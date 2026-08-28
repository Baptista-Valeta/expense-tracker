import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  editProfile: FormGroup = new FormGroup({
    name: new FormControl('', []),
    email: new FormControl('', [])
  });

  constructor(protected authService: AuthService) {};

  ngOnInit() {
    this.authService.getDataUser().subscribe(data => {
      this.editProfile.setValue({
        name: data.name,
        email: data.email
      });
    })
  };

  openForm(name: string, email: string) {
    alert(`${name}, ${email}`);
  }
}
