import { useState, useEffect } from 'react';
import { Lot } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { UserPlus, Save, X, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface AssignLotModalProps {
  open: boolean;
  onClose: () => void;
  lot: Lot | null;
}

export function AssignLotModal({ open, onClose, lot }: AssignLotModalProps) {
  const { assignLot, getClients } = useData();
  const { user } = useAuth();
  const clients = getClients();

  const [formData, setFormData] = useState({
    clientId: '',
    downPayment: 0,
    monthlyPayment: 0,
    totalMonths: 12,
    startDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && lot) {
      // Calculate suggested values
      const suggestedDown = Math.round(lot.price * 0.2); // 20% down payment
      const remaining = lot.price - suggestedDown;
      const suggestedMonthly = Math.round(remaining / 12);

      setFormData({
        clientId: '',
        downPayment: suggestedDown,
        monthlyPayment: suggestedMonthly,
        totalMonths: 12,
        startDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [open, lot]);

  // Recalculate monthly payment when down payment or months change
  const recalculateMonthly = () => {
    if (!lot) return;
    const remaining = lot.price - formData.downPayment;
    const monthly = Math.round(remaining / formData.totalMonths);
    setFormData(prev => ({ ...prev, monthlyPayment: monthly }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientId) newErrors.clientId = 'Selecciona un cliente';
    if (formData.downPayment < 0) newErrors.downPayment = 'El enganche no puede ser negativo';
    if (formData.monthlyPayment <= 0) newErrors.monthlyPayment = 'La mensualidad debe ser mayor a 0';
    if (formData.totalMonths <= 0) newErrors.totalMonths = 'El plazo debe ser mayor a 0';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !lot) return;

    assignLot(lot.id, formData.clientId, user?.id || '', {
      downPayment: formData.downPayment,
      monthlyPayment: formData.monthlyPayment,
      totalMonths: formData.totalMonths,
      startDate: formData.startDate,
    });
    onClose();
  };

  if (!lot) return null;

  const totalPlanAmount = formData.downPayment + (formData.monthlyPayment * formData.totalMonths);
  const difference = totalPlanAmount - lot.price;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader onClose={onClose}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/20">
              <UserPlus className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Asignar Lote {lot.number}</DialogTitle>
              <DialogDescription>
                Asigna este lote a un cliente con plan de pagos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            {/* Lot Info */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 text-sm">Lote:</span>
                <span className="text-white font-medium">{lot.number}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 text-sm">Área:</span>
                <span className="text-white">{lot.area} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Precio total:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(lot.price)}</span>
              </div>
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </option>
                ))}
              </Select>
              {errors.clientId && (
                <p className="text-xs text-rose-400">{errors.clientId}</p>
              )}
            </div>

            {/* Payment Plan */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Plan de Pagos</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Enganche (COP)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={formData.downPayment || ''}
                    onChange={(e) => setFormData({ ...formData, downPayment: Number(e.target.value) })}
                    onBlur={recalculateMonthly}
                  />
                  {errors.downPayment && (
                    <p className="text-xs text-rose-400">{errors.downPayment}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMonths">Plazo (meses)</Label>
                  <Select
                    id="totalMonths"
                    value={formData.totalMonths.toString()}
                    onChange={(e) => {
                      setFormData({ ...formData, totalMonths: Number(e.target.value) });
                      setTimeout(recalculateMonthly, 0);
                    }}
                  >
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                    <option value="18">18 meses</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                    <option value="60">60 meses</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPayment">Mensualidad (COP)</Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    value={formData.monthlyPayment || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyPayment: Number(e.target.value) })}
                  />
                  {errors.monthlyPayment && (
                    <p className="text-xs text-rose-400">{errors.monthlyPayment}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-rose-400">{errors.startDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Enganche:</span>
                <span className="text-white">{formatCurrency(formData.downPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{formData.totalMonths} mensualidades de:</span>
                <span className="text-white">{formatCurrency(formData.monthlyPayment)}</span>
              </div>
              <div className="border-t border-emerald-500/20 pt-2 flex justify-between">
                <span className="text-slate-300 font-medium">Total plan:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(totalPlanAmount)}</span>
              </div>
              {difference !== 0 && (
                <p className={`text-xs ${difference > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {difference > 0
                    ? `El plan excede el precio por ${formatCurrency(difference)}`
                    : `El plan está por debajo del precio por ${formatCurrency(Math.abs(difference))}`
                  }
                </p>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Asignar Lote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
