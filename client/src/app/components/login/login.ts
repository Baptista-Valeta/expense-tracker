import { Component } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";


import { AuthService } from '../../core/services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  validatorPasswordCaracter: number = 4;
  token: string = '';

  login = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.validatorPasswordCaracter)
    ])
  });

  get email() {
    return this.login.get("email");
  };

  get password() {
    return this.login.get("password");
  };

  constructor(
    private authService: AuthService, 
    private routeService: Router, 
    private toast: ToastrService
  ) {};
  
  ngOnInit() {
    // this.authService.isLoggedUser();
    this.toast.success('SUCESSO');
  };

  onSubmitLogin(dados: any) {
    console.log('Dados do login Valetilson:', dados);
    this.authService.postLoginUser(dados).subscribe({
      next: (res) => {
        console.log('retorno da api',res);
        const data: any = res;
        this.token = data.token;

        // Armazenar token no localStorage
        this.authService.setToken(this.token);

        console.log('Token:', this.token);

        setTimeout(() => {
          console.log('Navegando para dashboard!');
          this.routeService.navigate(['dashboard']);
        }, 1500);

      },
      error: (err) => {

        if ((err.status === 400) || (err.status === 401)) {
          this.toast.error('Email ou senha inválida!');
          console.error('Credenciais Inválidas', err);
          return;
        }else if(err.status === 0){
          this.toast.error('Servidor Fora de Serviço!', 'Erro');
          console.error('Servidor Offline ou fora de Serviço', err);
          return;
        };
        
        this.toast.error('Ocorreu um erro ao fazer login!', 'Erro');
        console.error("Erro Interno do Servidor:", err);
      }
    });

    // console.log('login response', loginResponse);

    if(this.password || this.email) return this.login.reset();
  };
};