import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const clienteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const user = authService.getCurrentUser();
  if (user && (user.role === 'GESTOR' || user.role === 'PROPRIETARIO' || user.role === 'ADMIN')) {
    return true;
  }

  notification.warning('Area disponivel apenas para gestores da imobiliaria.');
  router.navigate(['/dashboard']);
  return false;
};
