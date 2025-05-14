import { Routes } from '@angular/router';
import { isNotLoggedGuard } from './app/guards/is-not-logged.guard';
const routes: Routes = [
  {
    // Sin cuenta
    path: '',
    loadComponent: () =>
      import('./app/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canMatch: [isNotLoggedGuard],
  },
  {
    // Con cuenta
    path: '',
    loadComponent: () =>
      import('./app/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./app/pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      // {
      //   path: 'config',
      //   loadComponent: () =>
      //     import('./app/pages/config/general/general.component').then(
      //       (m) => m.GeneralComponent
      //     ),
      // },
      {
        path: 'tickets',
        children: [
          { path: "", loadComponent: () => import('./app/pages/ticket/ticket.component').then( (m) => m.TicketComponent ) },
          { path: "new", loadComponent: () => import('./app/pages/ticket/new/new.component').then( (m) => m.NewComponent ) }
        ]
      },
      {
        path: 'products',
        children: [
          { path: "", loadComponent: () => import('./app/pages/product/product.component').then( (m) => m.ProductComponent ) },
        ]
      },
    ],
  },
  {
    // Error pagina
    path: '404',
    loadComponent: () =>
      import('./app/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
  {
    path: ' ',
    pathMatch: 'full',
    redirectTo: '',
  },
];

export default routes;
