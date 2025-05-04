// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Almacena la URL que el usuario intentaba acceder
  // para redirigirlo después del login
  const redirectUrl = state.url;
  
  // Navega al login con el parámetro de redirección
  router.navigate(['/login'], { 
    queryParams: { redirect: redirectUrl }
  });
  
  return false;
};