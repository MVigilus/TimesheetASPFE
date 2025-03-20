import {effect, inject, Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn} from '@angular/router';

import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  effect(() => {
    const isAuthenticated = authService.currentUserValue;
    if (!isAuthenticated) {
      router.navigate(['/authentication/signin']);
    }
  });

  return !!authService.currentUserValue;
};
