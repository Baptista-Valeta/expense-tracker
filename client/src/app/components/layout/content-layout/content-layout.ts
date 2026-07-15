import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-content-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './content-layout.html',
  styleUrl: './content-layout.css',
})
export class ContentLayout {

}
