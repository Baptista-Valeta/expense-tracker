import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './components/dashboard/dashboard/dashboard';
import { AuthLayout } from './components/layout/auth-layout/auth-layout';
import { ContentLayout } from './components/layout/content-layout/content-layout';
import { Transactions } from './components/transactions/transactions';
import { CategoriesComponent } from './components/categories/categories';
import { ReportsComponent } from './components/reports/reports';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'expense-tracker',
        pathMatch: 'prefix'
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'prefix'
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
        ]
    },
    {
        path: 'expense-tracker',
        component: ContentLayout,
        children: [
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
                path: 'transactions',
                component: Transactions,
                title: 'Transações',
                canActivate: [authGuard],
            },
            {
                path: 'categories',
                component: CategoriesComponent,
                title: 'Categorias',
                canActivate: [authGuard]
            },
            {
                path: 'reports',
                component: ReportsComponent,
                title: 'Relatório',
                canActivate: [authGuard]
            },
            {
                path: 'profile',
                component: Profile,
                title: 'Perfil',
                // canActivate: [authGuard]
            }
        ]
    }

]; 