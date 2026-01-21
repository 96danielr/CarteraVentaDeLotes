import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserFormModal } from '@/components/modals/UserFormModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { User, UserRole } from '@/types';
import {
  Plus,
  Users,
  UserCog,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  Mail,
  Phone,
} from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  master: 'Master',
  admin: 'Admin',
  comercial: 'Comercial',
  cliente: 'Cliente',
};

const roleColors: Record<UserRole, string> = {
  master: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  admin: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  comercial: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  cliente: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  master: <ShieldCheck className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
  comercial: <Briefcase className="h-4 w-4" />,
  cliente: <UserIcon className="h-4 w-4" />,
};

export function UsersPage() {
  const { users, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);

    const matchesRole = filterRole === 'all' || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleNewUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  // Count by role
  const masterCount = users.filter(u => u.role === 'master').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const comercialCount = users.filter(u => u.role === 'comercial').length;
  const clienteCount = users.filter(u => u.role === 'cliente').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Usuarios</h1>
            <p className="text-slate-400">Gestiona los usuarios del sistema</p>
          </div>
        </div>
        <Button className="shadow-lg" onClick={handleNewUser}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{masterCount}</p>
              <p className="text-xs text-slate-400">Masters</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{adminCount}</p>
              <p className="text-xs text-slate-400">Admins</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{comercialCount}</p>
              <p className="text-xs text-slate-400">Comerciales</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">{clienteCount}</p>
              <p className="text-xs text-slate-400">Clientes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">Todos los roles</option>
          <option value="master">Master</option>
          <option value="admin">Admin</option>
          <option value="comercial">Comercial</option>
          <option value="cliente">Cliente</option>
        </Select>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredUsers.map(user => (
          <Card key={user.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColors[user.role]}`}>
                  {roleIcons[user.role]}
                </div>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <Badge className={roleColors[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {user.id !== currentUser?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-slate-400">No se encontraron usuarios</p>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${roleColors[user.role]}`}>
                        {roleIcons[user.role]}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400">{user.email}</TableCell>
                  <TableCell className="text-slate-400">{user.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        open={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que deseas eliminar a "${userToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
