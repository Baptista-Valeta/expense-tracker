import { Component } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";


import { AuthService } from '../../core/services/auth';

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
  } ;

  get password() {
    return this.login.get("password");
  }


  constructor(private authService: AuthService) {}
  
  onSubmitLogin() {
    const dados = this.login.value;
    this.authService.postLoginUser(dados);

    console.log(this.email?.value);
    console.log(this.password?.value);

    if(this.password) return this.login.reset();
  };
}
