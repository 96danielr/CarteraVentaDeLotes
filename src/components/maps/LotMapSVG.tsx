import { Lot, User } from '@/types';

interface LotMapSVGProps {
  lots: Lot[];
  selectedLotId?: string | null;
  onLotSelect?: (lot: Lot) => void;
  clients?: User[];
}

const STATUS_COLORS = {
  available: { fill: '#10b981', stroke: '#059669' },
  reserved: { fill: '#f59e0b', stroke: '#d97706' },
  sold: { fill: '#ef4444', stroke: '#dc2626' },
};

export function LotMapSVG({
  lots,
  selectedLotId,
  onLotSelect,
  clients = [],
}: LotMapSVGProps) {
  const getClientName = (clientId?: string) => {
    if (!clientId) return null;
    const client = clients.find((c) => c.id === clientId);
    return client?.name?.split(' ')[0] || null;
  };

  // Calcular viewBox dinámico basado en los lotes
  const lotsWithPosition = lots.filter((lot) => lot.mapPosition);

  if (lotsWithPosition.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No hay lotes con posición definida
      </div>
    );
  }

  // Calcular bounds
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  lotsWithPosition.forEach((lot) => {
    const pos = lot.mapPosition!;
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x + pos.width);
    maxY = Math.max(maxY, pos.y + pos.height);
  });

  const padding = 40;
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-white/10 p-4">
      <svg viewBox={viewBox} className="w-full h-full">
        {/* Lotes */}
        {lotsWithPosition.map((lot) => {
          const pos = lot.mapPosition!;
          const isSelected = selectedLotId === lot.id;
          const colors = STATUS_COLORS[lot.status];
          const clientName = getClientName(lot.clientId);

          const fontSize = Math.min(pos.width, pos.height) * 0.25;
          const smallFontSize = fontSize * 0.6;

          return (
            <g
              key={lot.id}
              onClick={() => onLotSelect?.(lot)}
              className="cursor-pointer"
            >
              {/* Lote shape */}
              {pos.polygon ? (
                <polygon
                  points={pos.polygon
                    .split(' ')
                    .map((p) => {
                      const [px, py] = p.split(',');
                      return `${pos.x + Number(px)},${pos.y + Number(py)}`;
                    })
                    .join(' ')}
                  fill={colors.fill}
                  fillOpacity={0.8}
                  stroke={isSelected ? '#ffffff' : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
              ) : (
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  rx={4}
                  fill={colors.fill}
                  fillOpacity={0.8}
                  stroke={isSelected ? '#ffffff' : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
              )}

              {/* Número de lote */}
              <text
                x={pos.x + pos.width / 2}
                y={pos.y + pos.height / 2 - (clientName ? smallFontSize * 0.5 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={fontSize}
                fontWeight="bold"
              >
                {lot.number}
              </text>

              {/* Área o nombre cliente */}
              <text
                x={pos.x + pos.width / 2}
                y={pos.y + pos.height / 2 + fontSize * 0.8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={smallFontSize}
                opacity={0.8}
              >
                {clientName || `${lot.area}m²`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Leyenda */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: STATUS_COLORS.available.fill }} />
          <span className="text-sm text-slate-300">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: STATUS_COLORS.reserved.fill }} />
          <span className="text-sm text-slate-300">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: STATUS_COLORS.sold.fill }} />
          <span className="text-sm text-slate-300">Vendido</span>
        </div>
      </div>
    </div>
  );
}
