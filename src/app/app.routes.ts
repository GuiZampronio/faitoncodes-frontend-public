import { Routes } from '@angular/router';

// Guard
import { canMatchGuard } from './guard/can-match.guard';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component'),
        canMatch: [canMatchGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component')
    },
    {
        path: 'turma/:id',
        loadChildren: () => import('./pages/turma/turma.routes').then((r) => r.turmaRoutes),
        canMatch: [canMatchGuard]
    },
    {
        path: 'not-found',
        loadComponent: () => import('./pages/not-found/not-found.component')
    },
    {
        path: '**',
        redirectTo: '/login', 
        pathMatch: 'full'
    }
];
