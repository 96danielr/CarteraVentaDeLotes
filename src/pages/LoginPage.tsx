import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';

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
    <div className="min-h-full flex flex-col items-center justify-start py-6 sm:py-[8vh] px-4 pb-8 relative overflow-y-auto overflow-x-hidden">
      {/* Animated background gradients - fixed position */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Subtle grid pattern - fixed position */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(217 33% 30%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 33% 30%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="w-full max-w-md relative z-10 fade-up">
        {/* Logo Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block mb-3 sm:mb-4">
            {/* Light glow behind logo for contrast */}
            <div className="absolute inset-0 bg-white/90 rounded-full blur-xl scale-75" />
            <img
              src="/TERRA VALORIS LOGO TRANSPARENCIA.png"
              alt="Terra Valoris"
              className="relative w-20 h-20 sm:w-28 sm:h-28 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">INVERSIONES TERRA VALORIS</h1>
          <p className="text-emerald-400 font-semibold text-xs sm:text-sm tracking-wider">S.A.S</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">Sistema de Gestión de Cartera</p>
        </div>

        {/* Login Card */}
        <Card className="glass border-white/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-white">Bienvenido</CardTitle>
            <CardDescription className="text-slate-400">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 p-4 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base btn-glow group"
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
            <div className="mt-6 sm:mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[hsl(222_47%_11%)] text-slate-500">Usuarios de prueba</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setEmail('master@lotes.com'); setPassword('master123'); }}
                  className="p-2.5 sm:p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/20 transition-all duration-200 group"
                >
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-400">Master</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate group-hover:text-slate-400">master@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@lotes.com'); setPassword('admin123'); }}
                  className="p-2.5 sm:p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/20 transition-all duration-200 group"
                >
                  <p className="text-[11px] sm:text-xs font-semibold text-purple-400">Admin</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate group-hover:text-slate-400">admin@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('ventas@lotes.com'); setPassword('ventas123'); }}
                  className="p-2.5 sm:p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/20 transition-all duration-200 group"
                >
                  <p className="text-[11px] sm:text-xs font-semibold text-emerald-400">Comercial</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate group-hover:text-slate-400">ventas@lotes.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('cliente1@email.com'); setPassword('cliente1123'); }}
                  className="p-2.5 sm:p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/20 transition-all duration-200 group"
                >
                  <p className="text-[11px] sm:text-xs font-semibold text-cyan-400">Cliente</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate group-hover:text-slate-400">cliente1@email.com</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Sistema POC v0.1.0
        </p>
      </div>
    </div>
  );
}
