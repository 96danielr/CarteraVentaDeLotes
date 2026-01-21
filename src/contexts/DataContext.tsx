import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, Lot, Payment, User, Commission, CommissionStatus } from '@/types';
import { projects as initialProjects } from '@/data/projects';
import { lots as initialLots } from '@/data/lots';
import { payments as initialPayments } from '@/data/payments';
import { users as initialUsers } from '@/data/users';
import { commissions as initialCommissions } from '@/data/commissions';
import { generateReceiptNumber } from '@/utils/formatters';

interface DataContextType {
  // Data
  projects: Project[];
  lots: Lot[];
  payments: Payment[];
  users: User[];
  commissions: Commission[];

  // Project operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Lot operations
  addLot: (lot: Omit<Lot, 'id'>) => void;
  updateLot: (id: string, data: Partial<Lot>) => void;
  deleteLot: (id: string) => void;
  assignLot: (lotId: string, clientId: string, salesPersonId: string, paymentPlan: {
    downPayment: number;
    monthlyPayment: number;
    totalMonths: number;
    startDate: string;
  }) => void;

  // Payment operations
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => void;

  // User operations
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;

  // Commission operations
  addCommission: (commission: Omit<Commission, 'id' | 'createdAt'>) => void;
  updateCommissionStatus: (id: string, status: CommissionStatus, userId: string) => void;

  // Queries
  getProjectById: (id: string) => Project | undefined;
  getLotById: (id: string) => Lot | undefined;
  getLotsByProject: (projectId: string) => Lot[];
  getLotsByClient: (clientId: string) => Lot[];
  getLotsBySalesPerson: (salesPersonId: string) => Lot[];
  getPaymentsByLot: (lotId: string) => Payment[];
  getPaymentsByClient: (clientId: string) => Payment[];
  getClientById: (id: string) => User | undefined;
  getClients: () => User[];
  getSalesPersons: () => User[];
  getCommissionsBySalesPerson: (salesPersonId: string) => Commission[];
  getCommissionsByStatus: (status: CommissionStatus) => Commission[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);

  // Project operations
  const addProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // Lot operations
  const addLot = useCallback((lotData: Omit<Lot, 'id'>) => {
    const newLot: Lot = {
      ...lotData,
      id: `lot-${Date.now()}`,
    };
    setLots(prev => [...prev, newLot]);
  }, []);

  const updateLot = useCallback((id: string, data: Partial<Lot>) => {
    setLots(prev => prev.map(l => (l.id === id ? { ...l, ...data } : l)));
  }, []);

  const deleteLot = useCallback((id: string) => {
    setLots(prev => prev.filter(l => l.id !== id));
  }, []);

  const assignLot = useCallback((
    lotId: string,
    clientId: string,
    salesPersonId: string,
    paymentPlan: {
      downPayment: number;
      monthlyPayment: number;
      totalMonths: number;
      startDate: string;
    }
  ) => {
    setLots(prev =>
      prev.map(l =>
        l.id === lotId
          ? {
              ...l,
              status: 'reserved' as const,
              clientId,
              salesPersonId,
              ...paymentPlan,
            }
          : l
      )
    );
  }, []);

  // Payment operations
  const addPayment = useCallback((paymentData: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: generateReceiptNumber(),
    };
    setPayments(prev => [...prev, newPayment]);
  }, []);

  // User operations
  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const getUserById = useCallback(
    (id: string) => users.find(u => u.id === id),
    [users]
  );

  // Queries
  const getProjectById = useCallback(
    (id: string) => projects.find(p => p.id === id),
    [projects]
  );

  const getLotById = useCallback(
    (id: string) => lots.find(l => l.id === id),
    [lots]
  );

  const getLotsByProject = useCallback(
    (projectId: string) => lots.filter(l => l.projectId === projectId),
    [lots]
  );

  const getLotsByClient = useCallback(
    (clientId: string) => lots.filter(l => l.clientId === clientId),
    [lots]
  );

  const getPaymentsByLot = useCallback(
    (lotId: string) => payments.filter(p => p.lotId === lotId).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
    [payments]
  );

  const getPaymentsByClient = useCallback(
    (clientId: string) => payments.filter(p => p.clientId === clientId).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [payments]
  );

  const getClientById = useCallback(
    (id: string) => users.find(u => u.id === id && u.role === 'cliente'),
    [users]
  );

  const getClients = useCallback(
    () => users.filter(u => u.role === 'cliente'),
    [users]
  );

  const getSalesPersons = useCallback(
    () => users.filter(u => u.role === 'comercial'),
    [users]
  );

  // Commission operations
  const addCommission = useCallback((commissionData: Omit<Commission, 'id' | 'createdAt'>) => {
    const newCommission: Commission = {
      ...commissionData,
      id: `com-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCommissions(prev => [...prev, newCommission]);
  }, []);

  const updateCommissionStatus = useCallback((id: string, status: CommissionStatus, userId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setCommissions(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const updates: Partial<Commission> = { status };
        if (status === 'approved') {
          updates.approvedAt = now;
          updates.approvedBy = userId;
        } else if (status === 'paid') {
          updates.paidAt = now;
          updates.paidBy = userId;
        }
        return { ...c, ...updates };
      })
    );
  }, []);

  const getLotsBySalesPerson = useCallback(
    (salesPersonId: string) => lots.filter(l => l.salesPersonId === salesPersonId),
    [lots]
  );

  const getCommissionsBySalesPerson = useCallback(
    (salesPersonId: string) => commissions.filter(c => c.salesPersonId === salesPersonId),
    [commissions]
  );

  const getCommissionsByStatus = useCallback(
    (status: CommissionStatus) => commissions.filter(c => c.status === status),
    [commissions]
  );

  return (
    <DataContext.Provider
      value={{
        projects,
        lots,
        payments,
        users,
        commissions,
        addProject,
        updateProject,
        deleteProject,
        addLot,
        updateLot,
        deleteLot,
        assignLot,
        addPayment,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        addCommission,
        updateCommissionStatus,
        getProjectById,
        getLotById,
        getLotsByProject,
        getLotsByClient,
        getLotsBySalesPerson,
        getPaymentsByLot,
        getPaymentsByClient,
        getClientById,
        getClients,
        getSalesPersons,
        getCommissionsBySalesPerson,
        getCommissionsByStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
