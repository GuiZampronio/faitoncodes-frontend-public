import { Routes } from '@angular/router';

export const turmaRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./turma.component')
    },
    {
        path: 'exercicio/:id',
        loadComponent: () => import('../exercise/exercise.component')
    }
];
