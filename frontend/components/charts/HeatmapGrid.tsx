// frontend/components/charts/HeatmapGrid.tsx
'use client';

import React from 'react';

interface HeatmapRow {
  label: string;
  values: number[]; // 0-100
}

interface HeatmapGridProps {
  columns: string[];
  rows: HeatmapRow[];
}

function scoreToBg(score: number): string {
  if (score < 50) return 'bg-red-300';
  if (score < 60) return 'bg-orange-300';
  if (score < 70) return 'bg-yellow-300';
  if (score < 80) return 'bg-lime-300';
  if (score < 90) return 'bg-green-300';
  return 'bg-emerald-400';
}

export default function HeatmapGrid({ columns, rows }: HeatmapGridProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${columns.length}, minmax(48px, 1fr))` }}>
          <div className="p-2 text-xs font-semibold text-gray-500">Vendor / Category</div>
          {columns.map(col => (
            <div key={col} className="p-2 text-xs font-semibold text-gray-500 text-center truncate" title={col}>{col}</div>
          ))}
          {rows.map(row => (
            <React.Fragment key={row.label}>
              <div className="p-2 text-sm font-medium text-gray-800 truncate" title={row.label}>{row.label}</div>
              {row.values.map((v, idx) => (
                <div key={idx} className={`m-1 h-8 rounded ${scoreToBg(v)} flex items-center justify-center text-[10px] text-gray-900/80`} title={`${v}`}>{v}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
