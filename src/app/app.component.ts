import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

// NgbToast
import { ToastsContainer } from "./toast/toasts/toasts-container.component";

// PrimeNg Toast
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterOutlet, ToastsContainer, ToastModule],
  providers: [],
  template: `
  <app-toasts />
  <p-toast />
  <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'angular-faiton-codes';
}