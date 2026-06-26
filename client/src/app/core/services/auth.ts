import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  apiUrl: string = 'http://localhost:5000/api/';
  token: any;


  constructor(private http: HttpClient) {}

  postLoginUser(payload: any) {
    console.log("Dados do login", payload)
    this.http.post(this.apiUrl+'auth/login', payload).subscribe(res => {
      console.log("Retorno da api:", res);

      this.token = res;

      console.log("token retornado", this.token.token);
    });
  };


  postRegisterUser(payload: any) {
    this.http.post(this.apiUrl+'auth/register', payload).subscribe(res => {
      console.log("Retorno da api",res);
    })
  }

};
