import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaymentGatewayModal } from '@/components/modals/PaymentGatewayModal';
import {
  formatCurrency,
  formatDateShort,
  getPaymentTypeLabel,
} from '@/utils/formatters';
import {
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

type PaymentOption = 'full' | 'partial' | 'extra';

interface PendingPayment {
  lotId: string;
  lotNumber: string;
  projectName: string;
  monthlyPayment: number;
  nextPaymentNumber: number;
  totalMonths: number;
  dueDate: string;
  isOverdue: boolean;
  remaining: number;
}

export function MyPaymentsPage() {
  const { user } = useAuth();
  const { lots, projects, payments, addPayment, getPaymentsByLot } = useData();

  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [showGateway, setShowGateway] = useState(false);

  // Obtener lotes del cliente
  const clientLots = useMemo(() => {
    return lots.filter(lot => lot.clientId === user?.id && (lot.status === 'sold' || lot.status === 'reserved'));
  }, [lots, user?.id]);

  // Calcular pagos pendientes
  const pendingPayments = useMemo((): PendingPayment[] => {
    return clientLots.map(lot => {
      const project = projects.find(p => p.id === lot.projectId);
      const lotPayments = getPaymentsByLot(lot.id);
      const monthlyPayments = lotPayments.filter(p => p.type === 'monthly');
      const totalPaid = lotPayments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = lot.price - totalPaid;

      // Calcular próxima fecha de pago
      const startDate = lot.startDate ? new Date(lot.startDate) : new Date();
      const nextPaymentNumber = monthlyPayments.length + 1;
      const nextDueDate = new Date(startDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + monthlyPayments.length);

      const today = new Date();
      const isOverdue = nextDueDate < today && remaining > 0;

      return {
        lotId: lot.id,
        lotNumber: lot.number,
        projectName: project?.name || 'Proyecto',
        monthlyPayment: lot.monthlyPayment || 0,
        nextPaymentNumber,
        totalMonths: lot.totalMonths || 0,
        dueDate: nextDueDate.toISOString().split('T')[0],
        isOverdue,
        remaining,
      };
    }).filter(p => p.remaining > 0);
  }, [clientLots, projects, getPaymentsByLot]);

  // Pagos recientes del cliente
  const recentPayments = useMemo(() => {
    return payments
      .filter(p => p.clientId === user?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [payments, user?.id]);

  const getPaymentAmount = () => {
    if (!selectedPayment) return 0;
    switch (paymentOption) {
      case 'full':
        return selectedPayment.monthlyPayment;
      case 'partial':
        return Math.min(parseFloat(partialAmount) || 0, selectedPayment.monthlyPayment);
      case 'extra':
        return Math.min(parseFloat(extraAmount) || 0, selectedPayment.remaining);
      default:
        return 0;
    }
  };

  const getPaymentConcept = () => {
    if (!selectedPayment) return '';
    switch (paymentOption) {
      case 'full':
        return `Mensualidad ${selectedPayment.nextPaymentNumber} de ${selectedPayment.totalMonths}`;
      case 'partial':
        return `Abono parcial - Mensualidad ${selectedPayment.nextPaymentNumber}`;
      case 'extra':
        return 'Pago anticipado a capital';
      default:
        return '';
    }
  };

  const handlePaymentSuccess = (paymentData: { amount: number; method: 'card' | 'transfer'; reference: string }) => {
    if (!selectedPayment || !user) return;

    // Registrar el pago
    addPayment({
      lotId: selectedPayment.lotId,
      clientId: user.id,
      amount: paymentData.amount,
      type: paymentOption === 'extra' ? 'extra' : 'monthly',
      paymentNumber: paymentOption !== 'extra' ? selectedPayment.nextPaymentNumber : undefined,
      date: new Date().toISOString().split('T')[0],
      method: paymentData.method === 'card' ? 'card' : 'transfer',
      notes: `Pago en línea - ${getPaymentConcept()} - Ref: ${paymentData.reference}`,
      createdBy: user.id,
    });

    // Reset
    setShowGateway(false);
    setSelectedPayment(null);
    setPaymentOption('full');
    setPartialAmount('');
    setExtraAmount('');
  };

  const openPaymentModal = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setPaymentOption('full');
    setPartialAmount('');
    setExtraAmount('');
  };

  if (clientLots.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Pagos</h1>
          <p className="text-muted-foreground">Realiza pagos de tus lotes</p>
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
      <div>
        <h1 className="text-2xl font-bold">Mis Pagos</h1>
        <p className="text-muted-foreground">Realiza pagos de tus lotes</p>
      </div>

      {/* Pagos pendientes */}
      <div className="grid gap-4">
        {pendingPayments.map(pending => (
          <Card key={pending.lotId} className={pending.isOverdue ? 'border-rose-500/30' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Info del lote */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pending.isOverdue ? 'bg-rose-500/20' : 'bg-emerald-500/20'
                  }`}>
                    <MapPin className={`h-6 w-6 ${pending.isOverdue ? 'text-rose-400' : 'text-emerald-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Lote {pending.lotNumber}</h3>
                    <p className="text-sm text-slate-400">{pending.projectName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="h-4 w-4" />
                        Vence: {formatDateShort(pending.dueDate)}
                      </span>
                      {pending.isOverdue && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Vencido
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Monto y botón */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-400">
                      Cuota {pending.nextPaymentNumber} de {pending.totalMonths}
                    </p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(pending.monthlyPayment)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Saldo: {formatCurrency(pending.remaining)}
                    </p>
                  </div>
                  <Button
                    onClick={() => openPaymentModal(pending)}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingPayments.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">¡Todo al día!</h3>
                <p className="text-muted-foreground">
                  No tienes pagos pendientes
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Opciones de pago (modal lateral) */}
      {selectedPayment && !showGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPayment(null)} />
          <Card className="relative w-full max-w-md z-10">
            <CardHeader>
              <CardTitle>Opciones de Pago</CardTitle>
              <p className="text-sm text-slate-400">Lote {selectedPayment.lotNumber}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Opción: Cuota completa */}
              <button
                onClick={() => setPaymentOption('full')}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  paymentOption === 'full'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-medium">Cuota Completa</p>
                      <p className="text-xs text-slate-400">
                        Mensualidad {selectedPayment.nextPaymentNumber}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(selectedPayment.monthlyPayment)}
                  </span>
                </div>
              </button>

              {/* Opción: Pago parcial */}
              <button
                onClick={() => setPaymentOption('partial')}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  paymentOption === 'partial'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="font-medium">Pago Parcial</p>
                    <p className="text-xs text-slate-400">Abono a la cuota actual</p>
                  </div>
                </div>
                {paymentOption === 'partial' && (
                  <Input
                    type="number"
                    placeholder="Monto a pagar"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    className="mt-2"
                    max={selectedPayment.monthlyPayment}
                  />
                )}
              </button>

              {/* Opción: Pago extra */}
              <button
                onClick={() => setPaymentOption('extra')}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  paymentOption === 'extra'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="font-medium">Pago Adelantado</p>
                    <p className="text-xs text-slate-400">Abona directo a capital</p>
                  </div>
                </div>
                {paymentOption === 'extra' && (
                  <Input
                    type="number"
                    placeholder="Monto a abonar"
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value)}
                    className="mt-2"
                    max={selectedPayment.remaining}
                  />
                )}
              </button>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setShowGateway(true)}
                  disabled={getPaymentAmount() <= 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  Continuar - {formatCurrency(getPaymentAmount())}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historial reciente */}
      {recentPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map(payment => {
                const lot = lots.find(l => l.id === payment.lotId);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium">Lote {lot?.number}</p>
                        <p className="text-xs text-slate-400">
                          {formatDateShort(payment.date)} • {getPaymentTypeLabel(payment.type)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-slate-500 font-mono">{payment.receiptNumber}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gateway Modal */}
      <PaymentGatewayModal
        open={showGateway}
        onClose={() => setShowGateway(false)}
        onSuccess={handlePaymentSuccess}
        amount={getPaymentAmount()}
        lotNumber={selectedPayment?.lotNumber || ''}
        concept={getPaymentConcept()}
      />
    </div>
  );
}
