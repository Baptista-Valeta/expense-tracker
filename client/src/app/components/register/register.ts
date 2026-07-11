import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
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
    private routeService: Router
  ) {}

  onSubmitRegister() {
    const registerData = this.registerForm.value;
    this.authService.postRegisterUser(registerData).subscribe({
      next: (res) => {
        const response: any = res;
        const username = response.user.name;

        console.log('Usuário', username);
        console.log('Resposta da api', response);    
        
        this.toast.success(`Cadastrado`, 'Sucesso');
        this.registerForm.reset();
      },
      error: (err) => {
        switch(err.status) {
          case 400:
            console.error('Email já cadastrado!', err);
            this.toast.error('Email já cadastrado!');
            break;
          case 500: 
            this.toast.error('Ocorreu um erro ao registrar', 'Erro');
            console.error('Erro interno do servidor', err);
            break;
          default: 
            this.toast.error('Servidor fora de serviço', 'Erro');
            console.error('Servidor offline', err);
        }
      }
    });
    
    console.log("Dados do usuário para o cadastro",this.registerForm.value);

    // this.registerForm.reset();
  };
}
