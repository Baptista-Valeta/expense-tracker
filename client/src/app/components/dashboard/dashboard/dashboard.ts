import { Component } from '@angular/core';

import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user: any; 

  constructor () {}

  ngOnInit() {

  };
}
