import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Users,
  CreditCard,
  FileText,
  Settings,
  X,
  BarChart3,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: ('master' | 'admin' | 'comercial' | 'cliente')[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Proyectos',
    path: '/projects',
    icon: <FolderKanban className="h-5 w-5" />,
    roles: ['master', 'admin', 'comercial'],
  },
  {
    label: 'Lotes',
    path: '/lots',
    icon: <MapPin className="h-5 w-5" />,
    roles: ['master', 'admin', 'comercial'],
  },
  {
    label: 'Clientes',
    path: '/clients',
    icon: <Users className="h-5 w-5" />,
    roles: ['master', 'admin', 'comercial'],
  },
  {
    label: 'Pagos',
    path: '/payments',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['master', 'admin', 'comercial'],
  },
  {
    label: 'Realizar Pago',
    path: '/my-payments',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['cliente'],
  },
  {
    label: 'Mi Estado de Cuenta',
    path: '/my-statement',
    icon: <FileText className="h-5 w-5" />,
    roles: ['cliente'],
  },
  {
    label: 'Estados de Cuenta',
    path: '/statements',
    icon: <FileText className="h-5 w-5" />,
    roles: ['master', 'admin', 'comercial'],
  },
  {
    label: 'Mis Ventas',
    path: '/my-sales',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ['comercial'],
  },
  {
    label: 'Comisiones',
    path: '/commissions',
    icon: <Award className="h-5 w-5" />,
    roles: ['master', 'admin'],
  },
  {
    label: 'Reportes',
    path: '/reports',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['master', 'admin'],
  },
  {
    label: 'Usuarios',
    path: '/users',
    icon: <Settings className="h-5 w-5" />,
    roles: ['master'],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 glass-sidebar transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <img
                src="/TERRA VALORIS LOGO TRANSPARENCIA.png"
                alt="Terra Valoris"
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="font-semibold text-sm text-white leading-tight">INVERSIONES</span>
                <span className="block text-xs text-emerald-400 font-bold tracking-wide">TERRA VALORIS</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
              Menú Principal
            </p>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del Sidebar */}
          <div className="p-4 border-t border-white/5">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-bold">TV</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">Terra Valoris</p>
                  <p className="text-[10px] text-slate-500">POC v0.1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
