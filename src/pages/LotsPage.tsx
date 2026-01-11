import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatArea, getLotStatusLabel, getLotStatusColor } from '@/utils/formatters';
import { MapPin, Grid3X3, Filter } from 'lucide-react';

export function LotsPage() {
  const { lots, projects, getClientById } = useData();
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLots = lots.filter(lot => {
    const project = projects.find(p => p.id === lot.projectId);
    const client = lot.clientId ? getClientById(lot.clientId) : null;

    const matchesSearch =
      lot.number.toLowerCase().includes(search.toLowerCase()) ||
      project?.name.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase());

    const matchesProject = filterProject === 'all' || lot.projectId === filterProject;
    const matchesStatus = filterStatus === 'all' || lot.status === filterStatus;

    return matchesSearch && matchesProject && matchesStatus;
  });

  const availableCount = filteredLots.filter(l => l.status === 'available').length;
  const reservedCount = filteredLots.filter(l => l.status === 'reserved').length;
  const soldCount = filteredLots.filter(l => l.status === 'sold').length;

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lotes</h1>
          <p className="text-muted-foreground">Visualiza y gestiona todos los lotes</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Buscar lote, proyecto o cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
              <Select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="w-full sm:w-44"
              >
                <option value="all">Proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-40"
              >
                <option value="all">Estado</option>
                <option value="available">Disponibles</option>
                <option value="reserved">Apartados</option>
                <option value="sold">Vendidos</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Grid3X3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{filteredLots.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{availableCount}</p>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{reservedCount}</p>
              <p className="text-xs text-muted-foreground">Apartados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{soldCount}</p>
              <p className="text-xs text-muted-foreground">Vendidos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredLots.map(lot => {
          const project = projects.find(p => p.id === lot.projectId);
          const client = lot.clientId ? getClientById(lot.clientId) : null;

          return (
            <Card key={lot.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {lot.block && `${lot.block}-`}{lot.number}
                    </p>
                    <p className="text-sm text-muted-foreground">{project?.name}</p>
                  </div>
                </div>
                <Badge className={getLotStatusColor(lot.status)}>
                  {getLotStatusLabel(lot.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Área</p>
                  <p className="font-medium">{formatArea(lot.area)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Precio</p>
                  <p className="font-medium">{formatCurrency(lot.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Cliente</p>
                  <p className="font-medium">{client?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Mensualidad</p>
                  <p className="font-medium text-accent">
                    {lot.monthlyPayment ? formatCurrency(lot.monthlyPayment) : '-'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredLots.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No se encontraron lotes</p>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Lote</TableHead>
                <TableHead className="font-semibold">Proyecto</TableHead>
                <TableHead className="font-semibold">Área</TableHead>
                <TableHead className="font-semibold">Precio</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Mensualidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map(lot => {
                const project = projects.find(p => p.id === lot.projectId);
                const client = lot.clientId ? getClientById(lot.clientId) : null;

                return (
                  <TableRow key={lot.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        {lot.block && `${lot.block}-`}{lot.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{project?.name}</span>
                    </TableCell>
                    <TableCell>{formatArea(lot.area)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(lot.price)}</TableCell>
                    <TableCell>
                      <Badge className={getLotStatusColor(lot.status)}>
                        {getLotStatusLabel(lot.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client ? (
                        <span className="text-foreground">{client.name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lot.monthlyPayment ? (
                        <span className="font-medium text-accent">{formatCurrency(lot.monthlyPayment)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredLots.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No se encontraron lotes</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
