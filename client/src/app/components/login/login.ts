import { Component } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";


import { AuthService } from '../../core/services/auth';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../core/services/token';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  validatorPasswordCaracter: number = 4;

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
    private tokenService: TokenService, 
    private toast: ToastrService
  ) {};
  
  ngOnInit() {

  };

  onSubmitLogin(dados: any) {
    console.log('Dados do login:', dados);
    if(!dados.email || !dados.password) {
      this.toast.info('Preencha todos os dados para o login');
      return;
    };

    this.authService.postLoginUser(dados).subscribe({
      next: (token) => {
        // Armazenar token no localStorage
        this.tokenService.setToken(token);

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
        }else if(err.status === 500){
          this.toast.error('Ocorreu um erro ao fazer login!', 'Erro');
          console.error("Erro Interno do Servidor:", err);
          return;
        };
        
        this.toast.error('Servidor Fora de Serviço! Tente novamente mais tarde', 'Erro');
        console.error('Servidor Offline ou fora de Serviço', err);
      }
    });

    if(this.password || this.email) return this.login.reset();
  };
};