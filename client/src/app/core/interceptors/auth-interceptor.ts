import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const routeService = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastrService);
  const token = authService.isLogged();
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });
  
  console.log('Authorization: '+newRequest.headers.get('Authorization'));

  return next(newRequest).pipe(
    tap(response => {
      console.log('INTERCEPTOR',response)
    }),
    catchError(error => {
      if(error.status === 401) {
        console.error('Acesso negado', error);
        toast.error('Usuário invalidado!');
        authService.logout();
        routeService.navigate(['login']);
      };

      console.error('Erro interceptado:', error);
      return throwError(() => error);
    })
  );
};


/**
 * 1- Adicionar token no cabeçalho
 * 2- Se o servidor responder 401:
 *    -Efetuar o logout, remover o token do localstorage
 *    -Redirecionar para login
 */