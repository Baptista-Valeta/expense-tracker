import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { RouterLink } from "@angular/router";

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
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.validatorPasswordCaracter)
    ])
  });
  

  constructor(private authService: AuthService) {}

  onSubmitRegister(): void {
    const registerData = this.registerForm.value
    this.authService.postRegisterUser(registerData);

    console.log("Dados do usuário para o login",this.registerForm.value)

    // this.registerForm.reset();
  }
}
