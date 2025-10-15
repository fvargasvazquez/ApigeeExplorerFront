import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/environment-selector',
    pathMatch: 'full'
  },
  {
    path: 'environment-selector',
    loadComponent: () => import('./components/environment-selector/environment-selector.component')
      .then(m => m.EnvironmentSelectorComponent)
  },
  {
    path: ':environment/search',
    loadComponent: () => import('./components/search/search.component')
      .then(m => m.SearchComponent)
  }
];