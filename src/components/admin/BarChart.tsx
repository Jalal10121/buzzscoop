"use client";

interface BarChartProps {
  data: { date: string; count: number }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count), 1);
  const displayData = data.slice(-14);

  return (
    <div className="w-full">
      <div className="flex items-end gap-1 sm:gap-2" style={{ height }}>
        {displayData.map((d) => {
          const percent = (d.count / max) * 100;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition">
                {d.count}
              </span>
              <div
                className="w-full bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-md min-h-[4px] transition-all hover:from-yellow-500 hover:to-yellow-600 cursor-pointer"
                style={{ height: `${Math.max(percent, 2)}%` }}
                title={`${d.date}: ${d.count}`}
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {d.date.split("-")[2]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}