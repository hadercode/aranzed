import { AuditRule } from '../audit-rule.types';

export const authAuditRules: AuditRule[] = [
  {
    path: '/auth/login',
    method: 'POST',
    model: 'Autenticación',
    action: 'LOGIN',
    description: (req) =>
      `Inicio de sesión para ${req.body?.email || 'usuario'}`,
  },
  {
    path: '/auth/register',
    method: 'POST',
    model: 'Autenticación',
    action: 'REGISTER',
    description: (req) => `Registro de nuevo usuario: ${req.body?.email || ''}`,
  },
  {
    path: '/auth/recover-password',
    method: 'POST',
    model: 'Autenticación',
    action: 'RECOVER_PASSWORD',
    description: (req) =>
      `Solicitud de recuperación de contraseña: ${req.body?.email || ''}`,
  },
  {
    path: '/auth/reset-password',
    method: 'POST',
    model: 'Autenticación',
    action: 'RESET_PASSWORD',
    description: 'Restablecimiento de contraseña',
  },
];
