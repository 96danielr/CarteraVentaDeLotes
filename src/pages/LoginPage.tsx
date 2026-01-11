import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertCircle, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="w-full max-w-md relative z-10 fade-in-up">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/25 mb-4">
              <MapPin className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Cartera de Lotes</h1>
          <p className="text-muted-foreground">Sistema de Gestión Inmobiliaria</p>
        </div>

        {/* Login Card */}
        <Card className="glass hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Bienvenido</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in slide-in-from-top duration-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base group"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Ingresar
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/70 text-muted-foreground">Usuarios de prueba</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setEmail('master@lotes.com'); setPassword('master123'); }}
                  className="p-3 text-left rounded-xl bg-white/50 hover:bg-white/80 border border-border/50 transition-all duration-200 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold text-foreground">Master</p>
                  <p className="text-xs text-muted-foreground truncate">master@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@lotes.com'); setPassword('admin123'); }}
                  className="p-3 text-left rounded-xl bg-white/50 hover:bg-white/80 border border-border/50 transition-all duration-200 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('ventas@lotes.com'); setPassword('ventas123'); }}
                  className="p-3 text-left rounded-xl bg-white/50 hover:bg-white/80 border border-border/50 transition-all duration-200 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold text-foreground">Comercial</p>
                  <p className="text-xs text-muted-foreground truncate">ventas@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('cliente1@email.com'); setPassword('cliente123'); }}
                  className="p-3 text-left rounded-xl bg-white/50 hover:bg-white/80 border border-border/50 transition-all duration-200 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold text-foreground">Cliente</p>
                  <p className="text-xs text-muted-foreground truncate">cliente1@email.com</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Sistema POC v0.1.0
        </p>
      </div>
    </div>
  );
}
