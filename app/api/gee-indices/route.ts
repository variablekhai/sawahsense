import { NextResponse } from "next/server";
import * as ee from "@google/earthengine";

export async function POST(request: Request) {
  try {
    const { fieldId, geometry, startDate, endDate } = await request.json();

    const projectId = process.env.GEE_PROJECT_ID;
    const serviceAccountEmail = process.env.GEE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GEE_PRIVATE_KEY;

    if (!projectId || !serviceAccountEmail || !privateKey) {
      return NextResponse.json(
        { error: "GEE credentials not configured" },
        { status: 503 },
      );
    }

    // Authenticate with service account
    await new Promise<void>((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        {
          type: "service_account",
          project_id: projectId,
          client_email: serviceAccountEmail,
          private_key: privateKey.replace(/\\n/g, "\n"),
        },
        () => {
          ee.initialize(null, null, resolve, reject);
        },
        reject,
      );
    });

    // Define field geometry
    const fieldGeom = ee.Geometry.Polygon(geometry.coordinates);

    // Query Sentinel-2 SR Harmonized
    const collection = ee
      .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
      .filterBounds(fieldGeom)
      .filterDate(startDate, endDate)
      .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 80))
      .map((img: unknown) => {
        const image = img as ReturnType<typeof ee.Image>;
        const nir = image.select("B8");
        const red = image.select("B4");
        const blue = image.select("B2");
        const swir = image.select("B11");

        const ndvi = nir.subtract(red).divide(nir.add(red)).rename("NDVI");
        const evi = image
          .expression(
            "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
            { NIR: nir, RED: red, BLUE: blue },
          )
          .rename("EVI");
        const lswi = nir.subtract(swir).divide(nir.add(swir)).rename("LSWI");

        return image
          .addBands(ndvi)
          .addBands(evi)
          .addBands(lswi)
          .set("cloud_pct", image.get("CLOUDY_PIXEL_PERCENTAGE"));
      });

    // Get time series metadata
    const imageList = collection.toList(30);
    const size = imageList.size().getInfo();

    const timeSeries = [];
    for (let i = 0; i < size; i++) {
      const img = ee.Image(imageList.get(i));
      const date = ee
        .Date(img.get("system:time_start"))
        .format("YYYY-MM-dd")
        .getInfo();
      const cloudPct = img.get("CLOUDY_PIXEL_PERCENTAGE").getInfo();

      const stats = img
        .select(["NDVI", "EVI", "LSWI"])
        .reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: fieldGeom,
          scale: 10,
          maxPixels: 1e9,
        })
        .getInfo();

      timeSeries.push({
        date,
        ndvi: stats.NDVI ? parseFloat(stats.NDVI.toFixed(3)) : null,
        evi: stats.EVI ? parseFloat(stats.EVI.toFixed(3)) : null,
        lswi: stats.LSWI ? parseFloat(stats.LSWI.toFixed(3)) : null,
        cloudPct: Math.round(cloudPct || 0),
      });
    }

    const latestClear = timeSeries
      .filter((p) => p.cloudPct < 40 && p.ndvi !== null)
      .at(-1);

    return NextResponse.json({
      fieldId,
      timeSeries,
      latestIndices: latestClear
        ? {
            ndvi: latestClear.ndvi,
            evi: latestClear.evi,
            lswi: latestClear.lswi,
          }
        : null,
      source: "live",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("GEE indices error:", err);
    return NextResponse.json(
      { error: "GEE unavailable", detail: err.message },
      { status: 503 },
    );
  }
}
