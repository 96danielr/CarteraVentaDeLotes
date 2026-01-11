import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { Plus, MapPin, Eye, Edit, Trash2, FolderKanban, Building2 } from 'lucide-react';

const statusLabels: Record<string, string> = {
  active: 'Activo',
  sold_out: 'Vendido',
  coming_soon: 'Próximamente',
};

const statusColors: Record<string, string> = {
  active: 'status-available',
  sold_out: 'status-sold',
  coming_soon: 'bg-primary/10 text-primary border border-primary/20',
};

export function ProjectsPage() {
  const { permissions } = useAuth();
  const { projects, lots } = useData();
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <FolderKanban className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
            <p className="text-muted-foreground">Gestiona los desarrollos inmobiliarios</p>
          </div>
        </div>
        {permissions?.canCreateProject && (
          <Button className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Buscar proyectos por nombre o ubicación..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map(project => {
          const projectLots = lots.filter(l => l.projectId === project.id);
          const sold = projectLots.filter(l => l.status === 'sold').length;
          const reserved = projectLots.filter(l => l.status === 'reserved').length;
          const available = projectLots.filter(l => l.status === 'available').length;
          const total = projectLots.length;
          const progress = total > 0 ? ((sold + reserved) / total) * 100 : 0;

          return (
            <Card key={project.id} className="overflow-hidden hover-lift group">
              {/* Project Image Placeholder */}
              <div className="h-36 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent)]" />
                <Building2 className="h-16 w-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
                <Badge className={`absolute top-3 right-3 ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-center">
                    <p className="text-lg font-bold text-accent">{available}</p>
                    <p className="text-xs text-muted-foreground">Disponibles</p>
                  </div>
                  <div className="p-2.5 bg-amber-100 rounded-xl text-center">
                    <p className="text-lg font-bold text-amber-700">{reserved}</p>
                    <p className="text-xs text-muted-foreground">Apartados</p>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-center">
                    <p className="text-lg font-bold text-primary">{sold}</p>
                    <p className="text-xs text-muted-foreground">Vendidos</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progreso de venta</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full progress-gradient rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">Precio desde</span>
                  <span className="font-semibold gradient-text">{formatCurrency(project.pricePerM2)}/m²</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/projects/${project.id}`}>
                      <Eye className="h-4 w-4 mr-1.5" />
                      Ver Detalles
                    </Link>
                  </Button>
                  {permissions?.canEditProject && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {permissions?.canDeleteProject && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No se encontraron proyectos</h3>
          <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
        </Card>
      )}
    </div>
  );
}
