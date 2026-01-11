import { UserRole, RolePermissions } from '../types';

export const rolePermissions: Record<UserRole, RolePermissions> = {
  master: {
    canViewAllProjects: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canViewAllClients: true,
    canAssignLots: true,
    canRegisterPayments: true,
    canViewOwnStatement: true,
    canDownloadPDF: true,
    canManageUsers: true,
    canViewReports: true,
  },
  admin: {
    canViewAllProjects: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canViewAllClients: true,
    canAssignLots: true,
    canRegisterPayments: true,
    canViewOwnStatement: true,
    canDownloadPDF: true,
    canManageUsers: false,
    canViewReports: true,
  },
  comercial: {
    canViewAllProjects: true,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canViewAllClients: true,
    canAssignLots: true,
    canRegisterPayments: true,
    canViewOwnStatement: true,
    canDownloadPDF: true,
    canManageUsers: false,
    canViewReports: false,
  },
  cliente: {
    canViewAllProjects: false,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canViewAllClients: false,
    canAssignLots: false,
    canRegisterPayments: false,
    canViewOwnStatement: true,
    canDownloadPDF: true,
    canManageUsers: false,
    canViewReports: false,
  },
};

export function getPermissions(role: UserRole): RolePermissions {
  return rolePermissions[role];
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission];
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    master: 'Master',
    admin: 'Administrador',
    comercial: 'Comercial',
    cliente: 'Cliente',
  };
  return labels[role];
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    master: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    comercial: 'bg-green-100 text-green-800',
    cliente: 'bg-gray-100 text-gray-800',
  };
  return colors[role];
}
