import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatArea, getLotStatusLabel, getLotStatusColor } from '@/utils/formatters';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getLotsByProject, getClientById } = useData();
  const { permissions } = useAuth();

  const project = getProjectById(id || '');
  const projectLots = getLotsByProject(id || '');

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Proyecto no encontrado</h2>
        <Button variant="link" asChild className="mt-4">
          <Link to="/projects">Volver a proyectos</Link>
        </Button>
      </div>
    );
  }

  const sold = projectLots.filter(l => l.status === 'sold').length;
  const reserved = projectLots.filter(l => l.status === 'reserved').length;
  const available = projectLots.filter(l => l.status === 'available').length;

  // Agrupar lotes por manzana/bloque
  const lotsByBlock = projectLots.reduce((acc, lot) => {
    const block = lot.block || 'Sin manzana';
    if (!acc[block]) acc[block] = [];
    acc[block].push(lot);
    return acc;
  }, {} as Record<string, typeof projectLots>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.location}</p>
        </div>
        {permissions?.canEditProject && (
          <Button variant="outline">Editar Proyecto</Button>
        )}
      </div>

      {/* Info del proyecto */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">{available}</p>
            <p className="text-sm text-muted-foreground">Lotes Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-yellow-600">{reserved}</p>
            <p className="text-sm text-muted-foreground">Lotes Apartados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-red-600">{sold}</p>
            <p className="text-sm text-muted-foreground">Lotes Vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{formatCurrency(project.pricePerM2)}</p>
            <p className="text-sm text-muted-foreground">Precio por m²</p>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
        </CardContent>
      </Card>

      {/* Mapa de Lotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mapa de Lotes</CardTitle>
          {permissions?.canAssignLots && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Lote
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {Object.entries(lotsByBlock).map(([block, blockLots]) => (
            <div key={block} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Manzana {block}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {blockLots.map(lot => {
                  const client = lot.clientId ? getClientById(lot.clientId) : null;

                  return (
                    <div
                      key={lot.id}
                      className={`
                        p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                        ${lot.status === 'available' ? 'border-green-300 bg-green-50 hover:border-green-400' : ''}
                        ${lot.status === 'reserved' ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400' : ''}
                        ${lot.status === 'sold' ? 'border-red-300 bg-red-50 hover:border-red-400' : ''}
                      `}
                    >
                      <div className="text-center">
                        <p className="font-bold">{lot.number}</p>
                        <p className="text-xs text-muted-foreground">{formatArea(lot.area)}</p>
                        <Badge className={`mt-1 ${getLotStatusColor(lot.status)}`} variant="secondary">
                          {getLotStatusLabel(lot.status)}
                        </Badge>
                        {client && (
                          <p className="text-xs mt-1 truncate" title={client.name}>
                            {client.name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {projectLots.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay lotes registrados en este proyecto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200 border-2 border-green-400" />
          <span className="text-sm">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-200 border-2 border-yellow-400" />
          <span className="text-sm">Apartado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-200 border-2 border-red-400" />
          <span className="text-sm">Vendido</span>
        </div>
      </div>
    </div>
  );
}
