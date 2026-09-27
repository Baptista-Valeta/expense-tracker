import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, throwError, tap, finalize, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { TokenService } from './token';
import { TransactionService } from './transaction';
import { environments } from '../../../environments/environments';
import { CategoryService } from './category';

interface Token {
  token: string
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  apiUrl: string = environments.URL_BASE;
  user= signal<User['user']|null>(null);

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private categoryService: CategoryService
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
    this.transactionService.transactions.set(null); // limpar a variável da lista de transações
    this.categoryService.categories.set(null) // Limpa a variável da lista de categorias
    return this.tokenService.removeToken();
  };
};