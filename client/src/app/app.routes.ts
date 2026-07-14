import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './components/dashboard/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix'
    },
    {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login,
        title: 'Login'
    },
    {
        path: 'register',
        component: Register,
        title: 'Cadastrar',
    }
]; 