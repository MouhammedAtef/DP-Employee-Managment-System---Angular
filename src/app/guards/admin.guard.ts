import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

const role = authService.getCurrentUserRole();

if (role === 'Admin') return true;

return router.createUrlTree(['/unauthorized']);
};
