import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RiderDetailsComponent } from './components/rider-details/rider-details.component';
import { PaymentsDomiComponent } from './components/payment-domi/payment-domi.component';
import { PaymentsClientComponent } from './components/payment-client/payment-client.component';
import { DomiDetailComponent } from './components/domi-detail/domi-detail.component';
import { PaymentSumaryComponent } from './components/payment-sumary/payment-sumary.component';


export const routes: Routes = [
  {  
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },  
  {
    path: 'riders',
    loadComponent: () => import('./pages/riders/riders.page').then( m => m.RidersPage),
    canActivate: [authGuard]
  },
  {
    path: 'riders/:id',
    component: RiderDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deliveries',
    loadComponent: () => import('./pages/deliveries/deliveries.page').then( m => m.DeliveriesPage),
    canActivate: [authGuard]
  },
  {
    path: 'delivery/details',
    loadComponent: ()=> import('./components/domi-detail/domi-detail.component').then(m =>m.DomiDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/clients.page').then( m => m.ClientsPage),
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    loadComponent: () => import('./pages/payments/payments.page').then( m => m.PaymentsPage),
    canActivate: [authGuard]
  },
  {
    path: 'payments/riders',
    component: PaymentsDomiComponent,
    canActivate: [authGuard]

  },
  {
    path: 'payments/clients',
    component: PaymentsClientComponent,
    canActivate: [authGuard]
  },    
  {
    path: 'payments/sumary',
    component: PaymentSumaryComponent,
    canActivate: [authGuard]
  }, 
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  
];
