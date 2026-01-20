import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel } from '@/utils/permissions';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass-header">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold text-white">
              Sistema de Gestión
            </h1>
            <p className="text-xs text-slate-500">
              Administra tus proyectos inmobiliarios
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notificaciones */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-white hover:bg-white/5 h-9 w-9"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
          </Button>

          {user && (
            <>
              {/* Mobile: Avatar only */}
              <div className="flex sm:hidden items-center gap-2 pl-2 border-l border-white/10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/20">
                  <User className="h-4 w-4 text-emerald-400" />
                </div>
              </div>

              {/* Desktop: Full info */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <Badge className={cn(
                    "text-[10px] font-medium border",
                    user.role === 'master' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    user.role === 'admin' && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                    user.role === 'comercial' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    user.role === 'cliente' && "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                  )}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/20">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Cerrar sesión"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
