import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const routeService = new Router();
  const authService = inject(AuthService)
  const isLogged = !!authService.isLogged();

  console.log('GUARDS TOKEN', isLogged)

  if(isLogged) {
    console.log('Usuário autenticado. Acesso ao dashboard');
    return true;
  };

  console.log('Usuário não autenticado. Redirecionando para login!');
  routeService.navigate(['auth/login']);
  return false;
};
