'use client';

import { SECHistoricalPoint } from '@/types/sec';
import { BarChart3 } from 'lucide-react';

interface FinancialChartProps {
  title: string;
  data: SECHistoricalPoint[];
  primaryColor?: string;
  gradientId: string;
}

export default function FinancialChart({
  title,
  data,
  primaryColor = 'var(--primary-500)',
  gradientId,
}: FinancialChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Historical SEC chart data not available</p>
      </div>
    );
  }

  const width = 600;
  const height = 240;
  const padding = { top: 40, right: 30, bottom: 40, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.val);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);

  const range = maxVal - Math.min(0, minVal);
  const zeroY = padding.top + chartHeight * (maxVal / (range || 1));

  const barGroupWidth = chartWidth / data.length;
  const barWidth = Math.min(barGroupWidth * 0.55, 48);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} style={{ color: primaryColor }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h4>
        </div>
        <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
          Multi-Year SEC 10-K
        </span>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '420px', display: 'block' }}
          role="img"
          aria-label={`${title} bar chart displaying ${data.length} annual fiscal periods`}
        >
          <title>{title}</title>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.9} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.25} />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Bars and Data Labels */}
          {data.map((pt, idx) => {
            const x = padding.left + idx * barGroupWidth + (barGroupWidth - barWidth) / 2;
            const barH = (Math.abs(pt.val) / (range || 1)) * chartHeight;
            const y = pt.val >= 0 ? zeroY - barH : zeroY;

            return (
              <g key={pt.year}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, 4)}
                  rx={4}
                  fill={`url(#${gradientId})`}
                  stroke={primaryColor}
                  strokeWidth={1}
                />
                {/* Value Label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="var(--text-main)"
                  fontSize={11}
                  fontWeight={600}
                >
                  {pt.formattedVal}
                </text>
                {/* Fiscal Year Label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 12}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize={12}
                  fontWeight={500}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
