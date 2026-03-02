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
import { getCurrentStage, STAGES } from "../../data/stageDefinitions";

interface DataPoint {
  date: string;
  ndvi: number;
  evi: number;
  lswi: number;
  cloudPct: number;
}

interface IndexChartProps {
  timeSeries: DataPoint[];
  transplantingDate: string;
  selectedDate: string | null;
  lang: "ms" | "en";
}

const CustomTooltip = ({ active, payload, label, lang }: any) => {
  if (!active || !payload || !payload.length) return null;

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
        {label}
      </p>
      {payload.map((entry: any) => (
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

export default function IndexChart({
  timeSeries,
  transplantingDate,
  selectedDate,
  lang,
}: IndexChartProps) {
  if (!timeSeries || timeSeries.length === 0) return null;

  // Filter out cloudy data from chart but keep the dates for reference
  const displayData = timeSeries.map((point) => ({
    ...point,
    dateShort: new Date(point.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    ndviDisplay: point.cloudPct > 40 ? null : point.ndvi,
    eviDisplay: point.cloudPct > 40 ? null : point.evi,
    lswiDisplay: point.cloudPct > 40 ? null : point.lswi,
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
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={displayData}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
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
              value: t.label.slice(0, 4),
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
          dataKey="lswiDisplay"
          name="LSWI"
          stroke="#58a6ff"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
