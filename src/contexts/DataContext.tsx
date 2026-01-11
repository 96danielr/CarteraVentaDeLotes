import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, Lot, Payment, User } from '@/types';
import { projects as initialProjects } from '@/data/projects';
import { lots as initialLots } from '@/data/lots';
import { payments as initialPayments } from '@/data/payments';
import { users as initialUsers } from '@/data/users';
import { generateReceiptNumber } from '@/utils/formatters';

interface DataContextType {
  // Data
  projects: Project[];
  lots: Lot[];
  payments: Payment[];
  users: User[];

  // Project operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Lot operations
  addLot: (lot: Omit<Lot, 'id'>) => void;
  updateLot: (id: string, data: Partial<Lot>) => void;
  assignLot: (lotId: string, clientId: string, salesPersonId: string, paymentPlan: {
    downPayment: number;
    monthlyPayment: number;
    totalMonths: number;
    startDate: string;
  }) => void;

  // Payment operations
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => void;

  // Queries
  getProjectById: (id: string) => Project | undefined;
  getLotById: (id: string) => Lot | undefined;
  getLotsByProject: (projectId: string) => Lot[];
  getLotsByClient: (clientId: string) => Lot[];
  getPaymentsByLot: (lotId: string) => Payment[];
  getPaymentsByClient: (clientId: string) => Payment[];
  getClientById: (id: string) => User | undefined;
  getClients: () => User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [users] = useState<User[]>(initialUsers);

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

  return (
    <DataContext.Provider
      value={{
        projects,
        lots,
        payments,
        users,
        addProject,
        updateProject,
        deleteProject,
        addLot,
        updateLot,
        assignLot,
        addPayment,
        getProjectById,
        getLotById,
        getLotsByProject,
        getLotsByClient,
        getPaymentsByLot,
        getPaymentsByClient,
        getClientById,
        getClients,
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
