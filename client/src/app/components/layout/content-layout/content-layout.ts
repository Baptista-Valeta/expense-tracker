import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-content-layout',
  imports: [RouterOutlet, Sidebar, RouterLinkWithHref],
  templateUrl: './content-layout.html',
  styleUrl: './content-layout.css',
})
export class ContentLayout {
  
}
