import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const isLogged = AuthService.prototype.isLoggedUser();
  let routeService = new Router();

  if(isLogged) {
    console.log('Usuário autenticado. Acesso ao dashboard');
    return true;
  };

  console.log('Usuário não autenticado. Redirecionando para login!');
  routeService.navigate(['login']);
  return false;
};
