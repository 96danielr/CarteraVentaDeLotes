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
  Sparkles,
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
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
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
          <div className="flex items-center justify-between p-5 border-b border-white/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-semibold text-lg text-foreground">Cartera</span>
                <span className="block text-xs text-muted-foreground font-medium">Gestión de Lotes</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/50"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
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
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md shadow-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/60'
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
          <div className="p-4 border-t border-white/50">
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">
                POC <span className="font-semibold text-primary">v0.1.0</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
