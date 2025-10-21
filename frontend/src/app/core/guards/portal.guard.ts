import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const portalGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const user = authService.getCurrentUser();
  if (user?.role === 'INQUILINO') {
    return true;
  }

  notification.error('Acesso restrito ao portal do inquilino.');
  router.navigate(['/dashboard']);
  return false;
};
























