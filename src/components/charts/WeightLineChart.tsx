import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WeightEntry } from '../../types/weight';
import { formatLocalDateString, formatWeight } from '../../utils/formatters';

interface WeightLineChartProps {
  entries: WeightEntry[];
}

export const WeightLineChart: React.FC<WeightLineChartProps> = ({ entries }) => {
  const { i18n } = useTranslation();

  if (!entries || entries.length === 0) {
    return null;
  }

  // Sort chronological
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const weights = sorted.map((e) => e.weightKg);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);
  const rangeW = maxW - minW || 1;

  const width = 360;
  const height = 160;
  const paddingX = 24;
  const paddingY = 20;

  const getX = (idx: number) => {
    if (sorted.length === 1) return width / 2;
    return paddingX + (idx / (sorted.length - 1)) * (width - 2 * paddingX);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - minW) / rangeW) * (height - 2 * paddingY);
  };

  const points = sorted.map((e, idx) => ({
    x: getX(idx),
    y: getY(e.weightKg),
    date: e.date,
    weight: e.weightKg,
  }));

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Closed path for subtle gradient area fill
  const areaD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : '';

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '12px 0' }}>
      <svg
        viewBox={`0 0 ${width} ${height + 25}`}
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="Weight Progression Chart"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[minW, (minW + maxW) / 2, maxW].map((gridVal, i) => {
          const y = getY(gridVal);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="2 2"
              />
              <text
                x={width - 4}
                y={y + 3}
                fill="var(--text-muted)"
                fontSize="9"
                textAnchor="end"
              >
                {Math.round(gridVal)} kg
              </text>
            </g>
          );
        })}

        {/* Gradient area fill */}
        {areaD && <path d={areaD} fill="url(#areaGrad)" />}

        {/* Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#06b6d4"
              stroke="#0f172a"
              strokeWidth="2"
            >
              <title>{`${pt.date}: ${formatWeight(pt.weight, i18n.language)}`}</title>
            </circle>
            {/* Show date label on first and last point */}
            {(idx === 0 || idx === points.length - 1 || sorted.length <= 4) && (
              <text
                x={pt.x}
                y={height + 15}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
              >
                {formatLocalDateString(pt.date, i18n.language, { month: 'numeric', day: 'numeric' })}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
