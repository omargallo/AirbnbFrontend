import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'].toString();
  const userRole = authService.role.toString();

  if (userRole.includes(allowedRoles || '')) {
    return true;
  } else {
    return router.navigate(['/']);
  }
};
