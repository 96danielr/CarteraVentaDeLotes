import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import {
  CreditCard,
  Building2,
  Shield,
  CheckCircle2,
  Loader2,
  X,
  Lock,
} from 'lucide-react';

interface PaymentGatewayModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentData: {
    amount: number;
    method: 'card' | 'transfer';
    reference: string;
  }) => void;
  amount: number;
  lotNumber: string;
  concept: string;
}

type Step = 'method' | 'card-form' | 'transfer-form' | 'processing' | 'success';

export function PaymentGatewayModal({
  open,
  onClose,
  onSuccess,
  amount,
  lotNumber,
  concept,
}: PaymentGatewayModalProps) {
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<'card' | 'transfer'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [reference, setReference] = useState('');

  if (!open) return null;

  const handleMethodSelect = (selectedMethod: 'card' | 'transfer') => {
    setMethod(selectedMethod);
    setStep(selectedMethod === 'card' ? 'card-form' : 'transfer-form');
  };

  const processPayment = () => {
    setStep('processing');

    // Simular procesamiento de pago
    setTimeout(() => {
      const ref = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setReference(ref);
      setStep('success');
    }, 2500);
  };

  const handleSuccess = () => {
    onSuccess({
      amount,
      method,
      reference,
    });
    // Reset state
    setStep('method');
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    setReference('');
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('method');
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
      onClose();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Pasarela de Pago</h2>
                <p className="text-xs text-slate-400">Pago seguro - Terra Valoris</p>
              </div>
            </div>
            {step !== 'processing' && (
              <button onClick={handleClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Amount Display */}
        <div className="p-4 bg-slate-800/50 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">Lote {lotNumber}</p>
              <p className="text-sm text-slate-300">{concept}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Total a pagar</p>
              <p className="text-xl font-bold text-emerald-400">{formatCurrency(amount)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step: Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 mb-4">Selecciona tu método de pago:</p>

              <button
                onClick={() => handleMethodSelect('card')}
                className="w-full p-4 rounded-xl border border-white/10 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/30 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Tarjeta de Crédito/Débito</p>
                  <p className="text-xs text-slate-400">Visa, Mastercard, American Express</p>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('transfer')}
                className="w-full p-4 rounded-xl border border-white/10 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/30 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">PSE / Transferencia</p>
                  <p className="text-xs text-slate-400">Débito directo de tu cuenta bancaria</p>
                </div>
              </button>
            </div>
          )}

          {/* Step: Card Form */}
          {step === 'card-form' && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Número de tarjeta</Label>
                <div className="relative mt-1">
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                    maxLength={19}
                    className="bg-slate-800/50 border-white/10 pl-10"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Nombre en la tarjeta</Label>
                <Input
                  placeholder="JUAN PEREZ"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                  className="bg-slate-800/50 border-white/10 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Vencimiento</Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                    maxLength={5}
                    className="bg-slate-800/50 border-white/10 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">CVV</Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      placeholder="***"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                      maxLength={4}
                      className="bg-slate-800/50 border-white/10 pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                  Volver
                </Button>
                <Button
                  onClick={processPayment}
                  disabled={!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  Pagar {formatCurrency(amount)}
                </Button>
              </div>
            </div>
          )}

          {/* Step: Transfer Form */}
          {step === 'transfer-form' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-emerald-400 font-medium mb-2">Simulación de PSE</p>
                <p className="text-xs text-slate-400">
                  En un entorno real, serás redirigido a tu banco para autorizar el pago.
                </p>
              </div>

              <div>
                <Label className="text-slate-300">Banco</Label>
                <select className="w-full mt-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Bancolombia</option>
                  <option>Davivienda</option>
                  <option>BBVA</option>
                  <option>Banco de Bogotá</option>
                  <option>Nequi</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                  Volver
                </Button>
                <Button
                  onClick={processPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  Continuar con PSE
                </Button>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center">
              <Loader2 className="w-16 h-16 text-emerald-400 mx-auto animate-spin" />
              <p className="mt-4 text-lg font-medium text-white">Procesando pago...</p>
              <p className="text-sm text-slate-400 mt-2">Por favor no cierres esta ventana</p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="py-6 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Pago Exitoso!</h3>
              <p className="text-slate-400 mb-4">Tu pago ha sido procesado correctamente</p>

              <div className="bg-slate-800/50 rounded-xl p-4 text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Referencia:</span>
                  <span className="text-white text-sm font-mono">{reference}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Monto:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Método:</span>
                  <span className="text-white text-sm">{method === 'card' ? 'Tarjeta' : 'PSE'}</span>
                </div>
              </div>

              <Button onClick={handleSuccess} className="w-full bg-emerald-600 hover:bg-emerald-500">
                Continuar
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && step !== 'processing' && (
          <div className="px-6 py-4 bg-slate-800/30 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Pago seguro con encriptación SSL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
