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
  notes?: string;
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
