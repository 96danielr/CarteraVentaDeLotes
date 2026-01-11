import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Download, MapPin } from 'lucide-react';

export function MyStatementPage() {
  const { user } = useAuth();
  const { lots, projects, getLotsByClient, getPaymentsByLot } = useData();
  const [selectedLotId, setSelectedLotId] = useState('');

  const clientLots = getLotsByClient(user?.id || '');

  const statement = useMemo(() => {
    const lotId = selectedLotId || (clientLots.length > 0 ? clientLots[0].id : '');
    if (!lotId) return null;

    const lot = lots.find(l => l.id === lotId);
    if (!lot) return null;

    const project = projects.find(p => p.id === lot.projectId);
    const lotPayments = getPaymentsByLot(lot.id);

    const totalPaid = lotPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = lot.price - totalPaid;
    const paidPercentage = (totalPaid / lot.price) * 100;

    const monthlyPayments = lotPayments.filter(p => p.type === 'monthly');
    const monthsPaid = monthlyPayments.length;
    const monthsRemaining = (lot.totalMonths || 0) - monthsPaid;

    return {
      lot,
      project,
      payments: lotPayments,
      totalPaid,
      remaining,
      paidPercentage,
      monthsPaid,
      monthsRemaining,
    };
  }, [selectedLotId, clientLots, lots, projects, getPaymentsByLot]);

  if (clientLots.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mi Estado de Cuenta</h1>
          <p className="text-muted-foreground">Consulta el estado de tus lotes</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Sin lotes asignados</h3>
              <p className="text-muted-foreground">
                Aún no tienes lotes asignados a tu cuenta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mi Estado de Cuenta</h1>
          <p className="text-muted-foreground">Consulta el estado de tus lotes</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {clientLots.length > 1 && (
        <Select
          value={selectedLotId || clientLots[0]?.id}
          onChange={(e) => setSelectedLotId(e.target.value)}
          className="w-full sm:w-64"
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
      )}

      {statement && (
        <div className="space-y-6">
          {/* Info del lote */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Lote {statement.lot.number}</CardTitle>
                  <p className="text-muted-foreground">{statement.project?.name}</p>
                  <p className="text-sm text-muted-foreground">{statement.project?.location}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Resumen financiero */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Precio Total</p>
                <p className="text-2xl font-bold">{formatCurrency(statement.lot.price)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(statement.totalPaid)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(statement.remaining)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold">{formatPercentage(statement.paidPercentage)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Barra de progreso */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Avance de pago</span>
                <span className="text-muted-foreground">
                  {statement.monthsPaid} de {statement.lot.totalMonths} mensualidades
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                  style={{ width: `${Math.min(statement.paidPercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Faltan {statement.monthsRemaining} mensualidades de {formatCurrency(statement.lot.monthlyPayment || 0)}
              </p>
            </CardContent>
          </Card>

          {/* Historial de pagos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDateShort(payment.date)}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.receiptNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPaymentTypeLabel(payment.type)}</Badge>
                      </TableCell>
                      <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {statement.payments.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No hay pagos registrados
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
