import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (authService.isAuthenticated()) {
    return true;
  }

  notification.warning('Sessao expirada. FAca login novamente.');
  router.navigate(['/auth/login']);
  return false;
};

























