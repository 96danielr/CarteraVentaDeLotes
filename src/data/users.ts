import { User } from '@/types';

// Mock users - En producción las credenciales se manejan con Supabase Auth
// Las contraseñas son solo para demo: el formato es {rol}123 (ej: master123, admin123)
export const users: User[] = [
  {
    id: 'usr-001',
    email: 'master@lotes.com',
    name: 'Carlos Mendoza',
    role: 'master',
    phone: '555-100-0001',
  },
  {
    id: 'usr-002',
    email: 'admin@lotes.com',
    name: 'Ana García',
    role: 'admin',
    phone: '555-100-0002',
  },
  {
    id: 'usr-003',
    email: 'ventas@lotes.com',
    name: 'Roberto Sánchez',
    role: 'comercial',
    phone: '555-100-0003',
    assignedProjects: ['proj-001', 'proj-002'],
  },
  {
    id: 'usr-004',
    email: 'maria@lotes.com',
    name: 'María López',
    role: 'comercial',
    phone: '555-100-0004',
    assignedProjects: ['proj-001', 'proj-003'],
  },
  {
    id: 'usr-005',
    email: 'cliente1@email.com',
    name: 'Juan Pérez',
    role: 'cliente',
    phone: '555-200-0001',
  },
  {
    id: 'usr-006',
    email: 'cliente2@email.com',
    name: 'Laura Martínez',
    role: 'cliente',
    phone: '555-200-0002',
  },
  {
    id: 'usr-007',
    email: 'cliente3@email.com',
    name: 'Pedro Hernández',
    role: 'cliente',
    phone: '555-200-0003',
  },
  {
    id: 'usr-008',
    email: 'cliente4@email.com',
    name: 'Sofia Ramírez',
    role: 'cliente',
    phone: '555-200-0004',
  },
];

// Función para validar credenciales mock
export const validateMockCredentials = (email: string, password: string): User | undefined => {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return undefined;

  // Mock: password es {nombre del usuario antes del @} + 123
  // master@lotes.com -> master123
  const expectedPassword = email.split('@')[0] + '123';
  if (password === expectedPassword) {
    return user;
  }
  return undefined;
};
