import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const user = authService.getCurrentUser();
  if (user?.role === 'ADMIN') {
    return true;
  }

  notification.warning('Acesso restrito aos administradores.');
  router.navigate(['/dashboard']);
  return false;
};

