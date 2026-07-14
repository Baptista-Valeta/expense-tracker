import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';
import { TokenService } from '../services/token';
import { inject } from '@angular/core';
import { authInterceptor } from '../interceptors/auth-interceptor';

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
  routeService.navigate(['login']);
  return false;
};
