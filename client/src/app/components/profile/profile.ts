import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { tap } from 'rxjs';

import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/services/auth';
import { Login } from '../login/login';

@Component({
  selector: 'app-profile',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  editProfile: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
  });

  validatorPasswordCaracter = inject(Login).validatorPasswordCaracter;
  ChangePasswordForms: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [
      Validators.minLength(this.validatorPasswordCaracter),
      Validators.required
    ]),
    confirm: new FormControl('', [
      Validators.required
    ]),
    newPassword: new FormControl('', [
      Validators.minLength(this.validatorPasswordCaracter),
      Validators.required
    ])
  });
  
  name () {
    return this.editProfile.get('name');
  };

  email () {
    return this.editProfile.get('email');
  };

  current () {
    return this.ChangePasswordForms.get('currentPassword');
  };

  confirm () {
    return this.ChangePasswordForms.get('confirm');
  };

  newPassword () {
    return this.ChangePasswordForms.get('newPassword');
  };
  
  constructor(protected authService: AuthService, private toastr: ToastrService) {};
  
  ngOnInit() {
    this.authService.getDataUser().subscribe(data => {
      this.editProfile.setValue({
        name: data.name,
        email: data.email,
      });
    });
  };

  UpdateProfile() {
    const name = this.name();
    const email = this.email();
    
    if(name?.invalid || email?.invalid) {
      alert('Nome ou email inválido');
      return;
    };

    this.authService.putProfile({name: name?.value, email: email?.value}).subscribe(data => {
      this.toastr.success('Perfil atualizado');
    });
  };
  
  changePassword() {
    this.ChangePasswordForms.markAllAsTouched();

    console.log(this.ChangePasswordForms.value, this.email()?.value);
    if(this.ChangePasswordForms.invalid) {
      return;
    };

    const payload = {email: this.email()?.value, password: this.current()?.value};
    this.authService.postLoginUser(payload).subscribe({
      next: data => {
        // current == ok
        console.log('TOKEN', data);
        if(this.current()?.value === this.confirm()?.value) {
          this.authService.putProfile({password: this.newPassword()?.value}).subscribe(response => {
            console.log('UPDATE PASSWORD', response);
            this.toastr.success('Palavra-passe alterada');
          });
        }else {
          this.toastr.error('A confirmação está incorreta');
        };
      },
      error: err => {
        this.toastr.error('A palavra-passe atual está incorreta');
      }
    });
  };

  openForm() {
    const modal = new bootstrap.Modal(document.getElementById('exampleModalToggle') as HTMLElement);
    modal.show();
  };

  resetForm() {
    this.ChangePasswordForms.reset();
  }
}
