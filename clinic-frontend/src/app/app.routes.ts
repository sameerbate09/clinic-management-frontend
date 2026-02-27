import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
    path: '', 
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
    },
    {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
];
