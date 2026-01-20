import { useState, useEffect } from 'react';
import { Project } from '@/types';
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
import { FolderKanban, Save, X } from 'lucide-react';

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null; // null = create mode, Project = edit mode
}

export function ProjectFormModal({ open, onClose, project }: ProjectFormModalProps) {
  const { addProject, updateProject } = useData();
  const isEditMode = !!project;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerM2: 0,
    status: 'active' as 'active' | 'sold_out' | 'coming_soon',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        location: project.location,
        description: project.description || '',
        pricePerM2: project.pricePerM2,
        status: project.status,
      });
    } else {
      setFormData({
        name: '',
        location: '',
        description: '',
        pricePerM2: 0,
        status: 'active',
      });
    }
    setErrors({});
  }, [project, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    if (formData.pricePerM2 <= 0) newErrors.pricePerM2 = 'El precio debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && project) {
      updateProject(project.id, formData);
    } else {
      addProject({
        ...formData,
        totalLots: 0,
        availableLots: 0,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader onClose={onClose}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/20">
              <FolderKanban className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <DialogTitle>
                {isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Modifica los datos del proyecto'
                  : 'Completa los datos para crear un nuevo proyecto'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del proyecto *</Label>
              <Input
                id="name"
                placeholder="Ej: Residencial Los Pinos"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-xs text-rose-400">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                placeholder="Ej: Bogotá, Cundinamarca"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              {errors.location && (
                <p className="text-xs text-rose-400">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerM2">Precio por m² (COP) *</Label>
                <Input
                  id="pricePerM2"
                  type="number"
                  placeholder="0"
                  value={formData.pricePerM2 || ''}
                  onChange={(e) => setFormData({ ...formData, pricePerM2: Number(e.target.value) })}
                />
                {errors.pricePerM2 && (
                  <p className="text-xs text-rose-400">{errors.pricePerM2}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                >
                  <option value="active">Activo</option>
                  <option value="coming_soon">Próximamente</option>
                  <option value="sold_out">Vendido</option>
                </Select>
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
