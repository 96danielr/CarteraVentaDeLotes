import { useState, useEffect } from 'react';
import { Lot } from '@/types';
import { useData } from '@/contexts/DataContext';
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
import { MapPin, Save, X } from 'lucide-react';

interface LotFormModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  lot?: Lot | null;
}

export function LotFormModal({ open, onClose, projectId, lot }: LotFormModalProps) {
  const { addLot, updateLot } = useData();
  const isEditMode = !!lot;

  const [formData, setFormData] = useState({
    number: '',
    block: '',
    area: 0,
    price: 0,
    status: 'available' as 'available' | 'reserved' | 'sold',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lot) {
      setFormData({
        number: lot.number,
        block: lot.block || '',
        area: lot.area,
        price: lot.price,
        status: lot.status,
        notes: lot.notes || '',
      });
    } else {
      setFormData({
        number: '',
        block: '',
        area: 0,
        price: 0,
        status: 'available',
        notes: '',
      });
    }
    setErrors({});
  }, [lot, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.number.trim()) newErrors.number = 'El número de lote es requerido';
    if (formData.area <= 0) newErrors.area = 'El área debe ser mayor a 0';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && lot) {
      updateLot(lot.id, {
        number: formData.number,
        block: formData.block || undefined,
        area: formData.area,
        price: formData.price,
        status: formData.status,
        notes: formData.notes || undefined,
      });
    } else {
      addLot({
        projectId,
        number: formData.number,
        block: formData.block || undefined,
        area: formData.area,
        price: formData.price,
        status: formData.status,
        notes: formData.notes || undefined,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader onClose={onClose}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center border border-cyan-500/20">
              <MapPin className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <DialogTitle>
                {isEditMode ? 'Editar Lote' : 'Nuevo Lote'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Modifica los datos del lote'
                  : 'Completa los datos para crear un nuevo lote'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número de lote *</Label>
                <Input
                  id="number"
                  placeholder="Ej: 01, A-01"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
                {errors.number && (
                  <p className="text-xs text-rose-400">{errors.number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="block">Manzana</Label>
                <Input
                  id="block"
                  placeholder="Ej: A, B, 1"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="0"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                />
                {errors.area && (
                  <p className="text-xs text-rose-400">{errors.area}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio (COP) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
                {errors.price && (
                  <p className="text-xs text-rose-400">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                disabled={isEditMode && (lot?.status === 'reserved' || lot?.status === 'sold')}
              >
                <option value="available">Disponible</option>
                <option value="reserved">Apartado</option>
                <option value="sold">Vendido</option>
              </Select>
              {isEditMode && (lot?.status === 'reserved' || lot?.status === 'sold') && (
                <p className="text-xs text-amber-400">El estado no se puede cambiar porque tiene cliente asignado</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                placeholder="Notas adicionales..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Guardar Cambios' : 'Crear Lote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
