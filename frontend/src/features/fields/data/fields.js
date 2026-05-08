/**
 * SawahSense Field Data — Sekinchan, Selangor (IADA Barat Laut Selangor)
 */

const RAW_FIELDS = [
  {
    id: "f1",
    name: "Petak A — Sekinchan Utara",
    location: "Sekinchan, Selangor",
    areaHa: 2.2,
    variety: "MR297",
    transplantingDate: "2025-09-03",
    centroid: [3.5299550765592116, 101.13180041313173],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12468719482423, 3.5275135499933956],
          [101.13683223724367, 3.535651981068987],
          [101.13893508911134, 3.5323537833894094],
          [101.12674713134767, 3.524300991785054],
          [101.12468719482423, 3.5275135499933956],
        ],
      ],
    },
  },
  {
    id: "f2",
    name: "Petak B — Sekinchan Tengah",
    location: "Sekinchan, Selangor",
    areaHa: 1.6,
    variety: "MR269",
    transplantingDate: "2025-09-05",
    centroid: [3.5331997409699594, 101.12969219684601],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12264871597291, 3.530683263209576],
          [101.13472938537599, 3.5387359994553473],
          [101.13674640655518, 3.535651981068987],
          [101.12464427948, 3.5277277201459274],
          [101.12264871597291, 3.530683263209576],
        ],
      ],
    },
  },
  {
    id: "f3",
    name: "Petak C — Sekinchan Timur",
    location: "Sekinchan, Selangor",
    areaHa: 3.1,
    variety: "MR297",
    transplantingDate: "2025-09-06",
    centroid: [3.5363587260532987, 101.12765908241273],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12052440643312, 3.533895799348431],
          [101.13271236419679, 3.5420341744251918],
          [101.13477230072023, 3.5387359994553473],
          [101.1226272583008, 3.5307689309842245],
          [101.12052440643312, 3.533895799348431],
        ],
      ],
    },
  },
  {
    id: "f4",
    name: "Petak D — Sekinchan Selatan",
    location: "Sekinchan, Selangor",
    areaHa: 2.5,
    variety: "MR297",
    transplantingDate: "2025-09-04",
    centroid: [3.5347096303825603, 101.11130833625795],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10434532165529, 3.5323537833894094],
          [101.11627578735353, 3.5401923379032407],
          [101.11829280853273, 3.5371083243634605],
          [101.10631942749023, 3.529184075874131],
          [101.10434532165529, 3.5323537833894094],
        ],
      ],
    },
  },
  {
    id: "f5",
    name: "Petak E — Ladang Komuniti",
    location: "Sekinchan, Selangor",
    areaHa: 4.0,
    variety: "MR297",
    transplantingDate: "2025-09-08",
    centroid: [3.5379221525330142, 101.10921621322632],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10219955444336, 3.5355663137451248],
          [101.11421585083009, 3.5434476743868255],
          [101.11623287200929, 3.540278004799458],
          [101.10421657562256, 3.5323966172006482],
          [101.10219955444336, 3.5355663137451248],
        ],
      ],
    },
  },
  {
    id: "f6",
    name: "Petak F — Sekinchan Baru",
    location: "Sekinchan, Selangor",
    areaHa: 1.8,
    variety: "MR297",
    transplantingDate: "2025-09-10",
    centroid: [3.5664381567797783, 101.09735012054443],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.08988285064699, 3.5658492182458636],
          [101.10352993011475, 3.570603586713232],
          [101.10486030578615, 3.5670485207196885],
          [101.0911273956299, 3.5622513014403294],
          [101.08988285064699, 3.5658492182458636],
        ],
      ],
    },
  },
];

export const FIELDS = RAW_FIELDS.map((field) => ({
  ...field,
  alertLevel: "healthy",
  latestIndices: { ndvi: 0, evi: 0, lswi: 0 },
  timeSeries: [],
  acquisitionDates: [],
}));

export function getFieldById(id) {
  return FIELDS.find((f) => f.id === id);
}

export function getFieldsSortedByAlert() {
  return [...FIELDS]; // Real data alert sorting logic will be done differently if alerts are derived from real data
}
