import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel, getRoleColor } from '@/utils/permissions';
import { Menu, LogOut, User, Bell } from 'lucide-react';

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
            className="lg:hidden hover:bg-white/60"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">
              Sistema de Gestión
            </h1>
            <p className="text-xs text-muted-foreground">
              Administra tus proyectos inmobiliarios
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notificaciones */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-white/60 h-9 w-9 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {user && (
            <>
              {/* Mobile: Avatar only */}
              <div className="flex sm:hidden items-center gap-2 pl-2 border-l border-border/50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/50">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Desktop: Full info */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border/50">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <Badge className={cn(getRoleColor(user.role), "text-xs")} variant="secondary">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/50">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Cerrar sesión"
                className="hover:bg-destructive/10 hover:text-destructive h-9 w-9 sm:h-10 sm:w-10"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
