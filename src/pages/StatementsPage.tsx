import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  formatPercentage,
} from '@/utils/formatters';
import { Download, FileText, User, MapPin, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

export function StatementsPage() {
  const [searchParams] = useSearchParams();
  const initialClient = searchParams.get('client') || '';

  const { lots, projects, getClients, getClientById, getPaymentsByLot } = useData();
  const [selectedClientId, setSelectedClientId] = useState(initialClient);
  const [selectedLotId, setSelectedLotId] = useState('');

  const clients = getClients();

  // Lotes del cliente seleccionado
  const clientLots = useMemo(() => {
    if (!selectedClientId) return [];
    return lots.filter(l => l.clientId === selectedClientId);
  }, [selectedClientId, lots]);

  // Estado de cuenta del lote seleccionado
  const statement = useMemo(() => {
    const lotId = selectedLotId || (clientLots.length > 0 ? clientLots[0].id : '');
    if (!lotId) return null;

    const lot = lots.find(l => l.id === lotId);
    if (!lot) return null;

    const project = projects.find(p => p.id === lot.projectId);
    const client = getClientById(lot.clientId || '');
    const lotPayments = getPaymentsByLot(lot.id);

    const totalPaid = lotPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = lot.price - totalPaid;
    const paidPercentage = (totalPaid / lot.price) * 100;

    // Calcular meses pagados (sin contar enganche)
    const monthlyPayments = lotPayments.filter(p => p.type === 'monthly');
    const monthsPaid = monthlyPayments.length;
    const monthsRemaining = (lot.totalMonths || 0) - monthsPaid;

    return {
      lot,
      project,
      client,
      payments: lotPayments,
      totalPaid,
      remaining,
      paidPercentage,
      monthsPaid,
      monthsRemaining,
    };
  }, [selectedLotId, clientLots, lots, projects, getClientById, getPaymentsByLot]);

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estados de Cuenta</h1>
          <p className="text-muted-foreground">Consulta el estado de cuenta de cada cliente</p>
        </div>
      </div>

      {/* Selectors */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Cliente</label>
            <Select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedLotId('');
              }}
              className="w-full"
            >
              <option value="">Selecciona un cliente</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          {clientLots.length > 0 && (
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Lote</label>
              <Select
                value={selectedLotId || clientLots[0]?.id}
                onChange={(e) => setSelectedLotId(e.target.value)}
                className="w-full"
              >
                {clientLots.map(lot => {
                  const project = projects.find(p => p.id === lot.projectId);
                  return (
                    <option key={lot.id} value={lot.id}>
                      Lote {lot.number} - {project?.name}
                    </option>
                  );
                })}
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Statement */}
      {statement ? (
        <div className="space-y-6">
          {/* Client Header */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/50">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{statement.client?.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Lote {statement.lot.number}</span>
                      <span className="text-border">|</span>
                      <span>{statement.project?.name}</span>
                    </div>
                  </div>
                </div>
                <Button className="shadow-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>

            <CardContent className="pt-6">
              {/* Main Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <DollarSign className="h-4 w-4" />
                    Precio Total
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(statement.lot.price)}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Total Pagado
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(statement.totalPaid)}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Saldo Pendiente
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(statement.remaining)}</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary text-sm mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Progreso
                  </div>
                  <p className="text-2xl font-bold gradient-text">{formatPercentage(statement.paidPercentage)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Avance de pago</span>
                  <span className="font-medium">{formatPercentage(statement.paidPercentage)}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full progress-gradient rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(statement.paidPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">Enganche</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(statement.lot.downPayment || 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Mensualidad</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(statement.lot.monthlyPayment || 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Plazo</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {statement.monthsPaid} / {statement.lot.totalMonths || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">meses</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {statement.monthsRemaining} meses restantes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                Historial de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.payments.map(payment => (
                    <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-muted-foreground">{formatDateShort(payment.date)}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                          {payment.receiptNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPaymentTypeLabel(payment.type)}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{getPaymentMethodLabel(payment.method)}</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-400">
                        +{formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {statement.payments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No hay pagos registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-10 w-10 text-primary/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Selecciona un cliente</h3>
          <p className="text-muted-foreground">
            Elige un cliente para ver su estado de cuenta detallado
          </p>
        </Card>
      )}
    </div>
  );
}
