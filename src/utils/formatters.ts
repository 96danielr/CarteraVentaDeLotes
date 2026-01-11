// Formatear moneda MXN
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Formatear fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Formatear fecha corta
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Formatear área en m2
export function formatArea(area: number): string {
  return `${area.toLocaleString('es-MX')} m²`;
}

// Formatear porcentaje
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Generar número de recibo
export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${timestamp}-${random}`;
}

// Obtener próxima fecha de pago
export function getNextPaymentDate(startDate: string, monthsPaid: number): string {
  const start = new Date(startDate);
  start.setMonth(start.getMonth() + monthsPaid + 1);
  return start.toISOString().split('T')[0];
}

// Verificar si un pago está vencido
export function isPaymentOverdue(dueDate: string): boolean {
  const today = new Date();
  const due = new Date(dueDate);
  return today > due;
}

// Días de retraso
export function getDaysOverdue(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = today.getTime() - due.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Status del lote a texto
export function getLotStatusLabel(status: 'available' | 'reserved' | 'sold'): string {
  const labels = {
    available: 'Disponible',
    reserved: 'Apartado',
    sold: 'Vendido',
  };
  return labels[status];
}

// Color del status del lote
export function getLotStatusColor(status: 'available' | 'reserved' | 'sold'): string {
  const colors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
  };
  return colors[status];
}

// Tipo de pago a texto
export function getPaymentTypeLabel(type: 'down_payment' | 'monthly' | 'extra'): string {
  const labels = {
    down_payment: 'Enganche',
    monthly: 'Mensualidad',
    extra: 'Pago Extra',
  };
  return labels[type];
}

// Método de pago a texto
export function getPaymentMethodLabel(method: 'cash' | 'transfer' | 'card' | 'check'): string {
  const labels = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    card: 'Tarjeta',
    check: 'Cheque',
  };
  return labels[method];
}
