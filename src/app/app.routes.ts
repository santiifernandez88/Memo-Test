import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then( m => m.LoginComponent)
  },
  {
    path: 'facil',
    loadComponent: () => import('./tab1/games/facil/facil.page').then( m => m.FacilPage)
  },
  {
    path: 'dificil',
    loadComponent: () => import('./tab1/games/dificil/dificil.page').then( m => m.DificilPage)
  },
  {
    path: 'medio',
    loadComponent: () => import('./tab1/games/medio/medio.page').then( m => m.MedioPage)
  },
];
