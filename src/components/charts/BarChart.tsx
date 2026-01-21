interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  barColor?: string;
}

export function BarChart({
  data,
  height = 200,
  showValues = true,
  formatValue = (v) => v.toString(),
  barColor = '#10b981',
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(20, Math.min(60, 100 / data.length - 2));

  return (
    <div className="w-full">
      <div
        className="flex items-end justify-around gap-2"
        style={{ height }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const color = item.color || barColor;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 flex-1"
              style={{ maxWidth: `${barWidth}%` }}
            >
              {/* Value on top */}
              {showValues && (
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  {formatValue(item.value)}
                </span>
              )}
              {/* Bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-700 ease-out relative group"
                style={{
                  height: `${Math.max(barHeight, 2)}%`,
                  background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
                  boxShadow: `0 0 20px ${color}30`,
                  minHeight: 4,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(180deg, ${color}40 0%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-around gap-2 mt-3 border-t border-white/10 pt-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 text-center"
            style={{ maxWidth: `${barWidth}%` }}
          >
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
