import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatArea, getLotStatusLabel, getLotStatusColor } from '@/utils/formatters';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { LotFormModal } from '@/components/modals/LotFormModal';
import { AssignLotModal } from '@/components/modals/AssignLotModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { Lot } from '@/types';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getLotsByProject, getClientById, deleteLot } = useData();
  const { permissions } = useAuth();

  const project = getProjectById(id || '');
  const projectLots = getLotsByProject(id || '');

  // Modal states
  const [showLotModal, setShowLotModal] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningLot, setAssigningLot] = useState<Lot | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Proyecto no encontrado</h2>
        <Button variant="link" asChild className="mt-4">
          <Link to="/projects">Volver a proyectos</Link>
        </Button>
      </div>
    );
  }

  const sold = projectLots.filter(l => l.status === 'sold').length;
  const reserved = projectLots.filter(l => l.status === 'reserved').length;
  const available = projectLots.filter(l => l.status === 'available').length;

  // Agrupar lotes por manzana/bloque
  const lotsByBlock = projectLots.reduce((acc, lot) => {
    const block = lot.block || 'Sin manzana';
    if (!acc[block]) acc[block] = [];
    acc[block].push(lot);
    return acc;
  }, {} as Record<string, typeof projectLots>);

  const handleNewLot = () => {
    setEditingLot(null);
    setShowLotModal(true);
  };

  const handleEditLot = (lot: Lot) => {
    setEditingLot(lot);
    setShowLotModal(true);
  };

  const handleAssignLot = (lot: Lot) => {
    setAssigningLot(lot);
    setShowAssignModal(true);
  };

  const handleDeleteClick = (lot: Lot) => {
    setLotToDelete(lot);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (lotToDelete) {
      deleteLot(lotToDelete.id);
      setLotToDelete(null);
      setSelectedLot(null);
    }
  };

  const handleLotClick = (lot: Lot) => {
    setSelectedLot(selectedLot?.id === lot.id ? null : lot);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-slate-400">{project.location}</p>
        </div>
      </div>

      {/* Info del proyecto */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-emerald-400">{available}</p>
            <p className="text-sm text-slate-400">Lotes Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-amber-400">{reserved}</p>
            <p className="text-sm text-slate-400">Lotes Apartados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-rose-400">{sold}</p>
            <p className="text-sm text-slate-400">Lotes Vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-white">{formatCurrency(project.pricePerM2)}</p>
            <p className="text-sm text-slate-400">Precio por m²</p>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Selected Lot Actions */}
      {selectedLot && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Lote seleccionado</p>
                <p className="text-lg font-bold text-white">
                  {selectedLot.block && `${selectedLot.block}-`}{selectedLot.number}
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    {formatArea(selectedLot.area)} • {formatCurrency(selectedLot.price)}
                  </span>
                </p>
                {selectedLot.clientId && (
                  <p className="text-sm text-slate-400">
                    Cliente: {getClientById(selectedLot.clientId)?.name}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {selectedLot.status === 'available' && permissions?.canAssignLots && (
                  <Button size="sm" onClick={() => handleAssignLot(selectedLot)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Asignar Cliente
                  </Button>
                )}
                {permissions?.canEditProject && (
                  <Button size="sm" variant="outline" onClick={() => handleEditLot(selectedLot)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
                {permissions?.canDeleteProject && selectedLot.status === 'available' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => handleDeleteClick(selectedLot)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa de Lotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mapa de Lotes</CardTitle>
          {permissions?.canAssignLots && (
            <Button size="sm" onClick={handleNewLot}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Lote
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {Object.entries(lotsByBlock).map(([block, blockLots]) => (
            <div key={block} className="mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                Manzana {block}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {blockLots.map(lot => {
                  const client = lot.clientId ? getClientById(lot.clientId) : null;
                  const isSelected = selectedLot?.id === lot.id;

                  return (
                    <div
                      key={lot.id}
                      onClick={() => handleLotClick(lot)}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all hover:shadow-lg
                        ${lot.status === 'available' ? 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50 hover:bg-emerald-500/20' : ''}
                        ${lot.status === 'reserved' ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50 hover:bg-amber-500/20' : ''}
                        ${lot.status === 'sold' ? 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 hover:bg-rose-500/20' : ''}
                        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900' : ''}
                      `}
                    >
                      <div className="text-center">
                        <p className="font-bold text-white">{lot.number}</p>
                        <p className="text-xs text-slate-400">{formatArea(lot.area)}</p>
                        <Badge className={`mt-1 ${getLotStatusColor(lot.status)}`} variant="secondary">
                          {getLotStatusLabel(lot.status)}
                        </Badge>
                        {client && (
                          <p className="text-xs mt-1 truncate text-slate-400" title={client.name}>
                            {client.name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {projectLots.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No hay lotes registrados en este proyecto</p>
              {permissions?.canAssignLots && (
                <Button onClick={handleNewLot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Lote
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50" />
          <span className="text-sm text-slate-300">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50" />
          <span className="text-sm text-slate-300">Apartado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/50" />
          <span className="text-sm text-slate-300">Vendido</span>
        </div>
      </div>

      {/* Lot Form Modal */}
      <LotFormModal
        open={showLotModal}
        onClose={() => {
          setShowLotModal(false);
          setEditingLot(null);
        }}
        projectId={project.id}
        lot={editingLot}
      />

      {/* Assign Lot Modal */}
      <AssignLotModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningLot(null);
          setSelectedLot(null);
        }}
        lot={assigningLot}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Lote"
        description={`¿Estás seguro de que deseas eliminar el lote "${lotToDelete?.number}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
