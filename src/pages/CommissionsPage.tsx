import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { CommissionStatus } from '@/types';
import {
  DollarSign,
  Clock,
  CheckCircle,
  Users,
  Wallet,
  Award,
} from 'lucide-react';

const statusLabels: Record<CommissionStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  paid: 'Pagada',
  cancelled: 'Cancelada',
};

const statusColors: Record<CommissionStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export function CommissionsPage() {
  const { user } = useAuth();
  const { commissions, users, updateCommissionStatus } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salesPersonFilter, setSalesPersonFilter] = useState<string>('all');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'pay';
    commissionId: string;
  } | null>(null);

  const salesPersons = useMemo(
    () => users.filter(u => u.role === 'comercial'),
    [users]
  );

  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const matchesSearch =
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSalesPerson = salesPersonFilter === 'all' || c.salesPersonId === salesPersonFilter;
      return matchesSearch && matchesStatus && matchesSalesPerson;
    });
  }, [commissions, searchTerm, statusFilter, salesPersonFilter]);

  // Métricas
  const metrics = useMemo(() => {
    const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const pending = commissions.filter(c => c.status === 'pending');
    const approved = commissions.filter(c => c.status === 'approved');
    const paid = commissions.filter(c => c.status === 'paid');

    const pendingAmount = pending.reduce((sum, c) => sum + c.commissionAmount, 0);
    const approvedAmount = approved.reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidAmount = paid.reduce((sum, c) => sum + c.commissionAmount, 0);

    return {
      total: totalCommissions,
      pending: { count: pending.length, amount: pendingAmount },
      approved: { count: approved.length, amount: approvedAmount },
      paid: { count: paid.length, amount: paidAmount },
    };
  }, [commissions]);

  // Métricas por vendedor
  const salesPersonMetrics = useMemo(() => {
    const metricsMap = new Map<string, {
      name: string;
      sales: number;
      totalAmount: number;
      commissions: number;
      pending: number;
    }>();

    salesPersons.forEach(sp => {
      metricsMap.set(sp.id, {
        name: sp.name,
        sales: 0,
        totalAmount: 0,
        commissions: 0,
        pending: 0,
      });
    });

    commissions.forEach(c => {
      const current = metricsMap.get(c.salesPersonId);
      if (current) {
        current.sales += 1;
        current.totalAmount += c.saleAmount;
        current.commissions += c.commissionAmount;
        if (c.status === 'pending' || c.status === 'approved') {
          current.pending += c.commissionAmount;
        }
      }
    });

    return Array.from(metricsMap.values());
  }, [commissions, salesPersons]);

  const getSalesPersonName = (id: string) => {
    return users.find(u => u.id === id)?.name || 'N/A';
  };

  const handleApprove = (id: string) => {
    if (user) {
      updateCommissionStatus(id, 'approved', user.id);
    }
    setConfirmAction(null);
  };

  const handlePay = (id: string) => {
    if (user) {
      updateCommissionStatus(id, 'paid', user.id);
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gestión de Comisiones</h1>
        <p className="text-muted-foreground">Administra las comisiones de los comerciales</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Comisiones</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(metrics.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pendientes</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.pending.amount)}</p>
                <p className="text-xs text-slate-500">{metrics.pending.count} comisiones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Por Pagar</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.approved.amount)}</p>
                <p className="text-xs text-slate-500">{metrics.approved.count} aprobadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pagadas</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.paid.amount)}</p>
                <p className="text-xs text-slate-500">{metrics.paid.count} comisiones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen por Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Rendimiento por Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {salesPersonMetrics.map((sp, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-800/50 border border-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{sp.name}</p>
                      <p className="text-xs text-slate-400">{sp.sales} ventas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      {formatCurrency(sp.commissions)}
                    </p>
                    <p className="text-xs text-slate-500">
                      comisiones totales
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Ventas: {formatCurrency(sp.totalAmount)}</span>
                  {sp.pending > 0 && (
                    <span className="text-amber-400">Pendiente: {formatCurrency(sp.pending)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros y Tabla */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lista de Comisiones</CardTitle>
            <div className="flex flex-wrap gap-2">
              <SearchInput
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
                className="w-48"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-44"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobadas</option>
                <option value="paid">Pagadas</option>
              </Select>
              <Select
                value={salesPersonFilter}
                onChange={(e) => setSalesPersonFilter(e.target.value)}
                className="w-48"
              >
                <option value="all">Todos los vendedores</option>
                {salesPersons.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead className="text-right">Venta</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map(commission => (
                  <TableRow key={commission.id}>
                    <TableCell className="text-slate-400">
                      {formatDateShort(commission.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getSalesPersonName(commission.salesPersonId)}
                    </TableCell>
                    <TableCell>{commission.clientName}</TableCell>
                    <TableCell>{commission.lotNumber}</TableCell>
                    <TableCell className="text-slate-400">{commission.projectName}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(commission.saleAmount)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-400">
                      {formatCurrency(commission.commissionAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[commission.status]}>
                        {statusLabels[commission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {commission.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                            onClick={() => setConfirmAction({ type: 'approve', commissionId: commission.id })}
                          >
                            Aprobar
                          </Button>
                        )}
                        {commission.status === 'approved' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => setConfirmAction({ type: 'pay', commissionId: commission.id })}
                          >
                            Pagar
                          </Button>
                        )}
                        {commission.status === 'paid' && (
                          <span className="text-xs text-slate-500">
                            Pagada: {commission.paidAt && formatDateShort(commission.paidAt)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCommissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                      No se encontraron comisiones
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={confirmAction?.type === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && handleApprove(confirmAction.commissionId)}
        title="Aprobar Comisión"
        description="¿Estás seguro de aprobar esta comisión? Una vez aprobada, estará lista para ser pagada."
        confirmText="Aprobar"
      />
      <ConfirmDialog
        open={confirmAction?.type === 'pay'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && handlePay(confirmAction.commissionId)}
        title="Registrar Pago"
        description="¿Confirmas que esta comisión ha sido pagada al vendedor?"
        confirmText="Confirmar Pago"
      />
    </div>
  );
}
