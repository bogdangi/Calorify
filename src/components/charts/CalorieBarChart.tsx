import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatLocalDateString, formatCalories } from '../../utils/formatters';

interface DailyData {
  date: string;
  calories: number;
}

interface CalorieBarChartProps {
  data: DailyData[];
  dailyGoal?: number;
}

export const CalorieBarChart: React.FC<CalorieBarChartProps> = ({ data, dailyGoal = 2000 }) => {
  const { i18n } = useTranslation();

  if (!data || data.length === 0) {
    return null;
  }

  const maxCalorie = Math.max(...data.map((d) => d.calories), dailyGoal, 100);
  const chartHeight = 160;
  const barWidth = 28;
  const gap = 16;
  const totalWidth = data.length * (barWidth + gap);

  // Goal line Y position
  const goalY = chartHeight - (dailyGoal / maxCalorie) * chartHeight;

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '12px 0' }}>
      <svg
        viewBox={`0 0 ${Math.max(totalWidth, 300)} ${chartHeight + 35}`}
        style={{ width: '100%', height: 'auto', minWidth: Math.max(totalWidth, 300) }}
        role="img"
        aria-label="Calorie Bar Chart"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="barOverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Goal dashed line */}
        <line
          x1="0"
          y1={goalY}
          x2={totalWidth}
          y2={goalY}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {data.map((item, index) => {
          const barHeight = Math.max((item.calories / maxCalorie) * chartHeight, 4);
          const x = index * (barWidth + gap) + gap / 2;
          const y = chartHeight - barHeight;
          const isOverGoal = item.calories > dailyGoal;
          const label = formatLocalDateString(item.date, i18n.language, { weekday: 'short' });

          return (
            <g key={item.date}>
              {/* Bar background highlight on hover */}
              <rect
                x={x - 2}
                y={0}
                width={barWidth + 4}
                height={chartHeight}
                fill="transparent"
                rx={6}
              >
                <title>{`${item.date}: ${formatCalories(item.calories, i18n.language)}`}</title>
              </rect>

              {/* Calorie Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={isOverGoal ? 'url(#barOverGrad)' : 'url(#barGrad)'}
              />

              {/* Calorie top label */}
              {item.calories > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={Math.max(y - 5, 12)}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {Math.round(item.calories)}
                </text>
              )}

              {/* Day bottom label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="11"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
