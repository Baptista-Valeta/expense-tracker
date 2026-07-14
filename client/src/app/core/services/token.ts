import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  
  constructor() {}

  setToken(token: string) {
    return localStorage.setItem('token', token);
  };

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    return localStorage.removeItem('token');
  };

}
