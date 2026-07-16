import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/services/auth';
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [Login],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  validatorPasswordCaracter: number = 4;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),    // if(this.password || this.email) return this.login.reset();

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.validatorPasswordCaracter)
    ])
  });
  

  constructor(
    private authService: AuthService, 
    private toast: ToastrService,
    private routeService: Router,
    public loginComponent: Login
  ) {};

  onSubmitRegister() {
    const registerData = this.registerForm.value;

    console.log("Dados do usuário para o cadastro",this.registerForm.value);
    if(!registerData.name || !registerData.email || !registerData.password) {
      this.toast.info('Preencha todos os dados para o cadastro');
      return;
    };


    return this.authService.postRegisterUser(registerData).subscribe({
      next: (user) => {        
        this.toast.success(`Cadastrado ${user.name}`, 'Sucesso');
        this.registerForm.reset();

        setTimeout(() => {
          console.log('Login automático');
          console.log('Navegando para dashboard');
          this.loginComponent.onSubmitLogin({email: registerData.email, password: registerData.password});
        },1500);

        return user;
      },
      error: (err) => {
        switch(err.status) {
          case 400:
            console.error('Email já cadastrado!', err);
            this.toast.error(err.error.message);
            break;
          case 500: 
            this.toast.error('Ocorreu um erro ao registrar', 'Erro');
            console.error('Erro interno do servidor', err);
            break;
          default: 
            this.toast.error('Servidor fora de serviço', 'Erro');
            console.error('Servidor offline', err);
        };
      }
    });
    
  };
}
