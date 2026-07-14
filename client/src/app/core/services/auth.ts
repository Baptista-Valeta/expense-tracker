import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  user: any | User;

  constructor(
    private http: HttpClient, 
    private routeService: Router,
    private tokenService: TokenService
  ) {};

  ngOnInit() {

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
        this.user = response.user;
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