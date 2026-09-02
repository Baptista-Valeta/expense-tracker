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
  
  return next(newRequest).pipe(
    tap(response => {
      console.log('INTERCEPTOR',response)
    }),
    catchError(error => {
      if(error.status === 401) {
        console.error('Usuário invalidado', error);

        authService.logout();
        routeService.navigate(['auth/login']);
      }else if(error.status === 0) {
        console.error('Servidor offline', error);
        toast.error('Servidor fora de serviço!');
      }else if(error.status === 500) {
        console.error('Erro do servidor', error);
        toast.error('Ups! Ocorreu algum problema no servidor');
      };

      return throwError(() => error);
    })
  );
};