import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { User, MapPin, CreditCard, FileText, Users, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientsPage() {
  const { getClients, getLotsByClient, getPaymentsByClient, projects } = useData();
  const [search, setSearch] = useState('');

  const clients = getClients();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone?.includes(search)
  );

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona la información de los clientes</p>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Buscar por nombre, email o teléfono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      {/* Client Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map(client => {
          const clientLots = getLotsByClient(client.id);
          const clientPayments = getPaymentsByClient(client.id);
          const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
          const totalDebt = clientLots.reduce((sum, l) => sum + l.price, 0);
          const progress = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

          return (
            <Card key={client.id} className="hover-lift">
              <CardContent className="pt-6">
                {/* Client Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border border-white/50">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lots */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{clientLots.length} lote(s)</span>
                  </div>

                  {clientLots.map(lot => {
                    const project = projects.find(p => p.id === lot.projectId);
                    return (
                      <div key={lot.id} className="ml-6 p-2 rounded-lg bg-white/50 border border-border/50 text-sm">
                        <div className="flex items-center justify-between">
                          <span>
                            <span className="font-medium">{lot.number}</span>
                            <span className="text-muted-foreground"> - {project?.name}</span>
                          </span>
                          <Badge className={lot.status === 'sold' ? 'status-sold' : 'status-reserved'}>
                            {lot.status === 'sold' ? 'Vendido' : 'Apartado'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Info */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pagado: </span>
                    <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso de pago</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full progress-gradient rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {formatCurrency(totalPaid)} de {formatCurrency(totalDebt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/statements?client=${client.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Estado de Cuenta
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No se encontraron clientes</h3>
          <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
        </Card>
      )}
    </div>
  );
}
