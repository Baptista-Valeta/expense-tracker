import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-content-layout',
  imports: [ RouterOutlet, Sidebar, UpperCasePipe ],
  templateUrl: './content-layout.html',
  styleUrl: './content-layout.css',
})
export class ContentLayout {
  public user = signal<any|null>(null);

  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.getDataUser().subscribe({
      next: (user => {
        this.user.set(user);
      })
    });    
  }
}
