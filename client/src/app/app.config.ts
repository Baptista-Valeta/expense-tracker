import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations'

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Login } from './components/login/login';
import { Sidebar } from './shared/sidebar/sidebar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor,
    ])),
    
    provideToastr({
      timeOut: 5000,
      preventDuplicates: true,
      positionClass: 'toast-top-right'
    }),

    provideAnimations(),
    provideNoopAnimations(),
    Login,
    Sidebar
  ]
};
