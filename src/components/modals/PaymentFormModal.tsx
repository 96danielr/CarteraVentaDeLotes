import { useState, useEffect } from 'react';
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
import { CreditCard, Save, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PaymentFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentFormModal({ open, onClose }: PaymentFormModalProps) {
  const { addPayment, lots, projects, getClients } = useData();
  const { user } = useAuth();
  const clients = getClients();

  // Filter lots that have clients (reserved or sold)
  const lotsWithClients = lots.filter(l => l.clientId);

  const [formData, setFormData] = useState({
    lotId: '',
    clientId: '',
    amount: 0,
    type: 'monthly' as 'down_payment' | 'monthly' | 'extra',
    method: 'transfer' as 'cash' | 'transfer' | 'card' | 'check',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // When lot changes, auto-select the client
  useEffect(() => {
    if (formData.lotId) {
      const lot = lots.find(l => l.id === formData.lotId);
      if (lot?.clientId) {
        setFormData(prev => ({ ...prev, clientId: lot.clientId! }));
      }
    }
  }, [formData.lotId, lots]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        lotId: lotsWithClients[0]?.id || '',
        clientId: lotsWithClients[0]?.clientId || '',
        amount: 0,
        type: 'monthly',
        method: 'transfer',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.lotId) newErrors.lotId = 'Selecciona un lote';
    if (!formData.clientId) newErrors.clientId = 'Selecciona un cliente';
    if (formData.amount <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addPayment({
      lotId: formData.lotId,
      clientId: formData.clientId,
      amount: formData.amount,
      type: formData.type,
      method: formData.method,
      date: formData.date,
      notes: formData.notes || undefined,
      createdBy: user?.id || '',
    });
    onClose();
  };

  const selectedLot = lots.find(l => l.id === formData.lotId);
  const selectedProject = selectedLot ? projects.find(p => p.id === selectedLot.projectId) : null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader onClose={onClose}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/20">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <DialogTitle>Registrar Pago</DialogTitle>
              <DialogDescription>
                Registra un nuevo pago de un cliente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            {lotsWithClients.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No hay lotes con clientes asignados</p>
                <p className="text-sm text-slate-500">Primero debes asignar un lote a un cliente</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lotId">Lote *</Label>
                  <Select
                    id="lotId"
                    value={formData.lotId}
                    onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
                  >
                    <option value="">Seleccionar lote...</option>
                    {lotsWithClients.map(lot => {
                      const project = projects.find(p => p.id === lot.projectId);
                      const client = clients.find(c => c.id === lot.clientId);
                      return (
                        <option key={lot.id} value={lot.id}>
                          Lote {lot.number} - {project?.name} ({client?.name})
                        </option>
                      );
                    })}
                  </Select>
                  {errors.lotId && (
                    <p className="text-xs text-rose-400">{errors.lotId}</p>
                  )}
                </div>

                {selectedLot && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Proyecto:</span>
                      <span className="text-white">{selectedProject?.name}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Precio lote:</span>
                      <span className="text-white">{formatCurrency(selectedLot.price)}</span>
                    </div>
                    {selectedLot.monthlyPayment && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mensualidad:</span>
                        <span className="text-emerald-400">{formatCurrency(selectedLot.monthlyPayment)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de pago *</Label>
                    <Select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                    >
                      <option value="down_payment">Enganche</option>
                      <option value="monthly">Mensualidad</option>
                      <option value="extra">Pago Extra</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Método de pago *</Label>
                    <Select
                      id="method"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as typeof formData.method })}
                    >
                      <option value="transfer">Transferencia</option>
                      <option value="cash">Efectivo</option>
                      <option value="card">Tarjeta</option>
                      <option value="check">Cheque</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto (COP) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    />
                    {errors.amount && (
                      <p className="text-xs text-rose-400">{errors.amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    {errors.date && (
                      <p className="text-xs text-rose-400">{errors.date}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Input
                    id="notes"
                    placeholder="Notas adicionales..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            {lotsWithClients.length > 0 && (
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Registrar Pago
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
