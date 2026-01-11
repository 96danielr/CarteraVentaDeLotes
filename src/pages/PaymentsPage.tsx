import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
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
import {
  formatCurrency,
  formatDateShort,
  getPaymentTypeLabel,
  getPaymentMethodLabel,
} from '@/utils/formatters';
import { Plus, CreditCard, DollarSign, Receipt, Filter } from 'lucide-react';

export function PaymentsPage() {
  const { payments, lots, getClientById, projects } = useData();
  const { permissions } = useAuth();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPayments = payments
    .filter(payment => {
      const lot = lots.find(l => l.id === payment.lotId);
      const client = getClientById(payment.clientId);

      const matchesSearch =
        payment.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
        client?.name.toLowerCase().includes(search.toLowerCase()) ||
        lot?.number.toLowerCase().includes(search.toLowerCase());

      const matchesType = filterType === 'all' || payment.type === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const engancheCount = filteredPayments.filter(p => p.type === 'down_payment').length;
  const mensualidadCount = filteredPayments.filter(p => p.type === 'monthly').length;

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pagos</h1>
            <p className="text-muted-foreground">Historial y registro de pagos</p>
          </div>
        </div>
        {permissions?.canRegisterPayments && (
          <Button className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pago
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{filteredPayments.length}</p>
              <p className="text-xs text-muted-foreground">Transacciones</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold text-accent">{engancheCount}</p>
              <p className="text-xs text-muted-foreground">Enganches</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-600">{mensualidadCount}</p>
              <p className="text-xs text-muted-foreground">Mensualidades</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
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
                placeholder="Buscar recibo, cliente o lote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />
            </div>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">Todos los tipos</option>
              <option value="down_payment">Enganche</option>
              <option value="monthly">Mensualidad</option>
              <option value="extra">Pago Extra</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredPayments.map(payment => {
          const lot = lots.find(l => l.id === payment.lotId);
          const project = lot ? projects.find(p => p.id === lot.projectId) : null;
          const client = getClientById(payment.clientId);

          return (
            <Card key={payment.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{client?.name || '-'}</p>
                    <p className="text-sm text-muted-foreground">{formatDateShort(payment.date)}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 text-lg">
                  +{formatCurrency(payment.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Recibo</p>
                  <p className="font-mono text-sm">{payment.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Lote</p>
                  <p className="font-medium">{lot?.number || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tipo</p>
                  <Badge variant="outline" className="font-normal mt-1">
                    {getPaymentTypeLabel(payment.type)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Método</p>
                  <p className="font-medium">{getPaymentMethodLabel(payment.method)}</p>
                </div>
              </div>

              {project && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">{project.name}</p>
                </div>
              )}
            </Card>
          );
        })}

        {filteredPayments.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No se encontraron pagos</p>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Recibo</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Lote</TableHead>
                <TableHead className="font-semibold">Proyecto</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Método</TableHead>
                <TableHead className="font-semibold text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => {
                const lot = lots.find(l => l.id === payment.lotId);
                const project = lot ? projects.find(p => p.id === lot.projectId) : null;
                const client = getClientById(payment.clientId);

                return (
                  <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <span className="text-muted-foreground">{formatDateShort(payment.date)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                        {payment.receiptNumber}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{client?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-xs text-primary font-medium">
                            {lot?.number?.charAt(0) || '-'}
                          </span>
                        </div>
                        {lot?.number || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{project?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {getPaymentTypeLabel(payment.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getPaymentMethodLabel(payment.method)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(payment.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No se encontraron pagos</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
