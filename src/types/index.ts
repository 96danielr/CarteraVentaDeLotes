// Roles del sistema
export type UserRole = 'master' | 'admin' | 'comercial' | 'cliente';

// Usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  assignedProjects?: string[]; // Para comerciales
  avatar?: string;
}

// Proyecto inmobiliario
export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  totalLots: number;
  availableLots: number;
  pricePerM2: number;
  status: 'active' | 'sold_out' | 'coming_soon';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Lote
export interface Lot {
  id: string;
  projectId: string;
  number: string; // Ej: "A-01", "B-15"
  block?: string; // Manzana
  area: number; // m2
  price: number;
  status: 'available' | 'reserved' | 'sold';
  clientId?: string;
  salesPersonId?: string;
  downPayment?: number; // Enganche
  monthlyPayment?: number; // Mensualidad
  totalMonths?: number; // Plazo en meses
  startDate?: string; // Fecha de inicio del plan de pagos
  saleDate?: string; // Fecha de la venta
  reservationDate?: string; // Fecha de reserva
  notes?: string;
  // Coordenadas para el mapa SVG
  mapPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number; // grados
    // Para lotes irregulares, polígono personalizado relativo a x,y
    polygon?: string; // ej: "0,0 100,0 100,80 50,100 0,80"
  };
}

// Pago
export interface Payment {
  id: string;
  lotId: string;
  clientId: string;
  amount: number;
  type: 'down_payment' | 'monthly' | 'extra';
  paymentNumber?: number; // Número de mensualidad
  date: string;
  receiptNumber: string;
  method: 'cash' | 'transfer' | 'card' | 'check';
  notes?: string;
  createdBy: string; // ID del usuario que registró el pago
}

// Estado de Cuenta (calculado)
export interface Statement {
  client: User;
  lot: Lot;
  project: Project;
  payments: Payment[];
  totalPrice: number;
  totalPaid: number;
  remaining: number;
  paidPercentage: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentStatus: 'on_time' | 'due_soon' | 'overdue';
  monthsPaid: number;
  monthsRemaining: number;
}

// Métricas del Dashboard
export interface DashboardMetrics {
  totalProjects: number;
  totalLots: number;
  soldLots: number;
  reservedLots: number;
  availableLots: number;
  totalSales: number;
  totalCollected: number;
  pendingCollection: number;
  clientsCount: number;
  overduePayments: number;
}

// Venta (registro de venta de lote)
export interface Sale {
  id: string;
  lotId: string;
  clientId: string;
  salesPersonId: string;
  saleDate: string;
  salePrice: number;
  downPayment: number;
  status: 'pending' | 'completed' | 'cancelled';
  contractNumber?: string;
  notes?: string;
}

// Comisión
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';
export type CommissionTrigger = 'on_sale' | 'on_down_payment' | 'on_completion';

export interface Commission {
  id: string;
  saleId?: string;
  lotId: string;
  salesPersonId: string;
  clientName: string;
  lotNumber: string;
  projectName: string;
  saleAmount: number;
  commissionRate: number; // Porcentaje (ej: 3 = 3%)
  commissionAmount: number;
  status: CommissionStatus;
  trigger: CommissionTrigger;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  paidBy?: string;
  notes?: string;
}

// Esquema de comisiones por proyecto
export interface CommissionScheme {
  id: string;
  projectId: string;
  type: 'percentage' | 'fixed' | 'tiered';
  rate: number; // Porcentaje o monto fijo
  tiers?: { minSales: number; rate: number }[];
  trigger: CommissionTrigger;
  isActive: boolean;
}

// Métricas de vendedor
export interface SalesPersonMetrics {
  salesPersonId: string;
  salesPersonName: string;
  totalSales: number;
  totalSalesAmount: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  conversionRate: number;
  averageSaleAmount: number;
  salesThisMonth: number;
  salesThisYear: number;
}

// Permisos por rol
export interface RolePermissions {
  canViewAllProjects: boolean;
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canViewAllClients: boolean;
  canAssignLots: boolean;
  canRegisterPayments: boolean;
  canViewOwnStatement: boolean;
  canDownloadPDF: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
}
