"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from "recharts";
import { STAGES } from "@/features/fields/lib/stage-definitions";

interface DataPoint {
  date: string;
  ndvi: number;
  evi: number;
  lswi: number;
  cloudPct: number;
}

interface ChartPoint extends DataPoint {
  dateShort: string;
  ndviDisplay: number | null;
  eviDisplay: number | null;
  lswiDisplay: number | null;
  ndviEstimated: number | null;
  eviEstimated: number | null;
  lswiEstimated: number | null;
}

interface IndexChartProps {
  timeSeries: DataPoint[];
  transplantingDate: string;
  selectedDate: string | null;
  lang: "ms" | "en";
}

interface TooltipEntry {
  name?: string;
  value?: number | null;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  lang: "ms" | "en";
}

const CustomTooltip = ({
  active,
  payload,
  label,
  lang,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const tooltipPayload = payload as TooltipEntry[];
  const payloadFiltered = tooltipPayload.filter((entry) => {
    const isEstimated = String(entry.name || "").includes("(Est.)");
    if (!isEstimated) return true;
    const baseName = String(entry.name).replace(" (Est.)", "");
    const measuredExists = tooltipPayload.some(
      (p) => p.name === baseName && p.value !== null && p.value !== undefined,
    );
    return !measuredExists;
  });

  return (
    <div
      style={{
        background: "rgba(22, 27, 34, 0.97)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 12px",
        backdropFilter: "blur(8px)",
        fontFamily: "IBM Plex Mono, monospace",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontSize: "0.6875rem",
          color: "var(--text-secondary)",
        }}
      >
        {lang === "ms" ? "Tarikh" : "Date"}: {label}
      </p>
      {payloadFiltered.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <span
            style={{
              width: 8,
              height: 2,
              background: entry.color,
              display: "inline-block",
            }}
          />
          <span
            style={{ fontSize: "0.75rem", color: entry.color, fontWeight: 600 }}
          >
            {entry.name}: {entry.value?.toFixed(3)}
          </span>
        </div>
      ))}
    </div>
  );
};

function getStageAtDate(transplantingDate: string, targetDate: string) {
  const transplant = new Date(transplantingDate);
  const target = new Date(targetDate);
  const daysSince = Math.floor(
    (target.getTime() - transplant.getTime()) / 86400000,
  );
  return STAGES.find((s) => daysSince >= s.dayStart && daysSince <= s.dayEnd);
}

function buildEstimatedSeries(
  values: Array<number | null>,
): Array<number | null> {
  const estimated = Array<number | null>(values.length).fill(null);
  let i = 0;

  while (i < values.length) {
    if (values[i] !== null) {
      i++;
      continue;
    }

    const gapStart = i;
    while (i < values.length && values[i] === null) i++;
    const gapEnd = i - 1;

    const prevIdx = gapStart - 1 >= 0 ? gapStart - 1 : -1;
    const nextIdx = i < values.length ? i : -1;
    const prevVal = prevIdx >= 0 ? values[prevIdx] : null;
    const nextVal = nextIdx >= 0 ? values[nextIdx] : null;

    if (prevVal !== null && prevIdx >= 0) {
      estimated[prevIdx] = prevVal;
    }
    if (nextVal !== null && nextIdx >= 0) {
      estimated[nextIdx] = nextVal;
    }

    for (let k = gapStart; k <= gapEnd; k++) {
      if (
        prevVal !== null &&
        nextVal !== null &&
        prevIdx >= 0 &&
        nextIdx >= 0
      ) {
        const ratio = (k - prevIdx) / (nextIdx - prevIdx);
        estimated[k] = prevVal + (nextVal - prevVal) * ratio;
      } else if (prevVal !== null) {
        estimated[k] = prevVal;
      } else if (nextVal !== null) {
        estimated[k] = nextVal;
      } else {
        estimated[k] = null;
      }
    }
  }

  return estimated;
}

export function IndexChart({
  timeSeries,
  transplantingDate,
  selectedDate,
  lang,
}: IndexChartProps) {
  if (!timeSeries || timeSeries.length === 0) return null;

  // Keep measured points as solid lines; fill cloudy gaps with dotted estimates.
  const measured = timeSeries.map((point) => ({
    ndviDisplay: point.cloudPct > 40 ? null : point.ndvi,
    eviDisplay: point.cloudPct > 40 ? null : point.evi,
    lswiDisplay: point.cloudPct > 40 ? null : point.lswi,
  }));
  const ndviEstimated = buildEstimatedSeries(
    measured.map((p) => p.ndviDisplay),
  );
  const eviEstimated = buildEstimatedSeries(measured.map((p) => p.eviDisplay));
  const lswiEstimated = buildEstimatedSeries(
    measured.map((p) => p.lswiDisplay),
  );

  const displayData: ChartPoint[] = timeSeries.map((point, idx) => ({
    ...point,
    dateShort: new Date(point.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    ndviDisplay: measured[idx].ndviDisplay,
    eviDisplay: measured[idx].eviDisplay,
    lswiDisplay: measured[idx].lswiDisplay,
    ndviEstimated: ndviEstimated[idx],
    eviEstimated: eviEstimated[idx],
    lswiEstimated: lswiEstimated[idx],
  }));

  // Find stage transition points for reference lines
  const stageTransitions: { date: string; label: string; color: string }[] = [];
  let lastStage = "";
  for (const point of displayData) {
    const stage = getStageAtDate(transplantingDate, point.date);
    if (stage && stage.id !== lastStage) {
      if (lastStage !== "") {
        stageTransitions.push({
          date: point.dateShort,
          label: lang === "ms" ? stage.nameMy : stage.nameEn,
          color: stage.color,
        });
      }
      lastStage = stage.id;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: "600px",
          height: "100%",
          paddingBottom: "8px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(48, 54, 61, 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="dateShort"
              tick={{
                fill: "var(--text-muted)",
                fontSize: "0.5625rem",
                fontFamily: "IBM Plex Mono, monospace",
              }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 1]}
              tick={{
                fill: "var(--text-muted)",
                fontSize: "0.5625rem",
                fontFamily: "IBM Plex Mono, monospace",
              }}
              tickLine={false}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip lang={lang} />} />

            {/* Stage transition lines */}
            {stageTransitions.map((t) => (
              <ReferenceLine
                key={t.date}
                x={t.date}
                stroke={t.color}
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: t.label,
                  position: "insideTopRight",
                  fill: t.color,
                  fontSize: 8,
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              />
            ))}

            {/* Selected date line */}
            {selectedDate && (
              <ReferenceLine
                x={new Date(selectedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
                stroke="var(--accent-blue)"
                strokeDasharray="6 3"
                strokeWidth={2}
              />
            )}

            {/* Legend */}
            <Legend
              iconType="line"
              iconSize={12}
              wrapperStyle={{
                fontSize: "0.625rem",
                fontFamily: "IBM Plex Mono, monospace",
                paddingTop: "4px",
              }}
            />

            <Line
              type="monotone"
              dataKey="ndviDisplay"
              name="NDVI"
              stroke="#3fb950"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="ndviEstimated"
              name="NDVI (Est.)"
              stroke="#3fb950"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
              strokeDasharray="4 4"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="eviDisplay"
              name="EVI"
              stroke="#39d353"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
              strokeDasharray="none"
            />
            <Line
              type="monotone"
              dataKey="eviEstimated"
              name="EVI (Est.)"
              stroke="#39d353"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
              strokeDasharray="4 4"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="lswiDisplay"
              name="LSWI"
              stroke="#58a6ff"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="lswiEstimated"
              name="LSWI (Est.)"
              stroke="#58a6ff"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
              strokeDasharray="4 4"
              legendType="none"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IndexChart;
