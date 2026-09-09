import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, throwError, tap, finalize, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { TokenService } from './token';

interface Token {
  token: string
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  apiUrl: string = 'http://localhost:5000/api/';
  user= signal<User['user']|null>(null);

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService
  ) {};

  ngOnInit() {}

  getDataUser() {
    return this.http.get<User>(this.apiUrl+'auth/profile').pipe(
      tap(response => {
        // console.log('Dados do usuário: '+ response.user.name);
      }),
      map(response => {
        return response.user;
      }),
      catchError(error => {
        console.error('Erro ao buscar dados do usuário: ' + error);
        return throwError (() => error);
      })
    )
  }

  postLoginUser(payload: {email: string, password: string}) {
    return this.http.post<Token>(this.apiUrl+'auth/login', payload).pipe(
      map(response => {
        return response.token;
      }),
      catchError(error => {
          if(error.status === 400) {
            console.log('Credenciais inválidas', error);
          };
        return throwError(() => error);
      })
    );
  };
  
  postRegisterUser(payload: any) {
    return this.http.post<User>(this.apiUrl+'auth/register', payload).pipe(
      tap(response => {
        // console.log("Registrado", response.user);
      }),
      map(response => {
        return response.user;
      })
    );
  };

  putProfile(payload: {name?: string, email?: string, password?: string}) {
    return this.http.put<User>(this.apiUrl+'auth/profile', payload).pipe(
      catchError(error => throwError(() => error))
    );
  };

  isLogged() {
    return this.tokenService.getToken();
  };

  logout() {
    // console.log('logout');
    return this.tokenService.removeToken();
  };
};