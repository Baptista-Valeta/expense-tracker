import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, throwError, tap, finalize, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { TokenService } from './token';

interface Token {
  message: string,
  token: string
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  apiUrl: string = 'http://localhost:5000/api/';

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService
  ) {};

  ngOnInit() {
  }

  getDataUser() {
    return this.http.get<User>(this.apiUrl+'auth/profile').pipe(
      tap(response => {
        console.log('Dados do usuário: '+ response.user.name);
      }),
      map(response => {
        return response.user;
      }),
      catchError(error => {
        console.error('Erro ao buscar dados do usuário: ' + error)
        return throwError (() => error);
      })
    )
  }

  postLoginUser(payload: any) {
    return this.http.post<Token>(this.apiUrl+'auth/login', payload).pipe(
      map(response => {
        return response.token;
      }),
    );
  };
  
  postRegisterUser(payload: any) {
    return this.http.post<User>(this.apiUrl+'auth/register', payload).pipe(
      tap(response => {
        console.log("Registrado", response.user);
      }),
      map(response => {
        return response.user;
      })
    );
  };

  isLogged() {
    return this.tokenService.getToken();
  };

  logout() {
    console.log('logout')
    return this.tokenService.removeToken();
  };
};