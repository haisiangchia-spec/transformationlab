import { useId, useState } from "react";
import { chartScale, DIMENSIONS, type Report } from "../report/model";
import { num } from "./shared";
export const dimensionColours = {
  sensing: "#28e5ee",
  modelling: "#6caaff",
  acting: "#ffd65c",
};
export function CapabilityChart({
  report,
  selected,
  onSelect,
}: {
  report: Report;
  selected: number;
  onSelect: (year: number) => void;
}) {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    sensing: true,
    modelling: true,
    acting: true,
  });
  const id = useId();
  const scale = chartScale(report.rounds.map((r) => r.capabilities));
  const x = (year: number) => 65 + (year - 1) * 142;
  const y = (value: number) => 235 - (value / scale.upper) * 205;
  return (
    <>
      <div className="chart-legend" role="group" aria-label="Chart series">
        {DIMENSIONS.map((d) => (
          <button
            key={d}
            aria-pressed={visible[d]}
            onClick={() => setVisible({ ...visible, [d]: !visible[d] })}
            style={{ color: dimensionColours[d] }}
          >
            <i />
            {d}
          </button>
        ))}
      </div>
      <svg
        className="capability-chart"
        viewBox="0 0 700 290"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>
          Five-year Sensing, Modelling and Acting capabilities
        </title>
        <desc id={`${id}-desc`}>
          Raw uncapped capabilities after each year's engine rewards, including
          that year's event penalties. A data table follows.
        </desc>
        <rect
          x={x(selected) - 31}
          y="22"
          width="62"
          height="220"
          rx="8"
          fill="#21cbea"
          fillOpacity=".06"
        />
        {scale.ticks.map((t) => (
          <g key={t}>
            <line
              x1="65"
              x2="633"
              y1={y(t)}
              y2={y(t)}
              stroke="#25516b"
              strokeDasharray="3 5"
            />
            <text x="49" y={y(t) + 4} textAnchor="end">
              {num(t)}
            </text>
          </g>
        ))}
        <line x1="65" x2="65" y1="25" y2="235" stroke="#5e8aa3" />
        <line x1="65" x2="633" y1="235" y2="235" stroke="#5e8aa3" />
        {DIMENSIONS.filter((d) => visible[d]).map((d) => (
          <g key={d}>
            <polyline
              points={report.rounds
                .map((r) => `${x(r.round)},${y(r.capabilities[d])}`)
                .join(" ")}
              fill="none"
              stroke={dimensionColours[d]}
              strokeWidth="2.7"
              strokeLinejoin="round"
            />
            {report.rounds.map((r) => (
              <circle
                key={r.round}
                cx={x(r.round)}
                cy={y(r.capabilities[d])}
                r={selected === r.round ? 5.5 : 4}
                fill={dimensionColours[d]}
                stroke="#092b42"
                strokeWidth="2"
              />
            ))}
          </g>
        ))}
        {report.rounds.map((r) => (
          <g
            key={r.round}
            onClick={() => onSelect(r.round)}
            className="chart-hit"
          >
            <rect
              x={x(r.round) - 35}
              y="20"
              width="70"
              height="240"
              fill="transparent"
            />
            <text x={x(r.round)} y="265" textAnchor="middle">
              Year {r.round}
            </text>
          </g>
        ))}
      </svg>
      <div
        className="chart-year-selector"
        role="group"
        aria-label="Inspect capability year"
      >
        {report.rounds.map((r) => (
          <button
            key={r.round}
            onClick={() => onSelect(r.round)}
            aria-pressed={selected === r.round}
          >
            YEAR {r.round}
          </button>
        ))}
      </div>
      <div className="selected-capabilities" aria-live="polite">
        <span>YEAR {selected}</span>
        {DIMENSIONS.map((d) => (
          <span key={d} style={{ color: dimensionColours[d] }}>
            {d} <b>{num(report.rounds[selected - 1]!.capabilities[d])}</b>
          </span>
        ))}
      </div>
    </>
  );
}
