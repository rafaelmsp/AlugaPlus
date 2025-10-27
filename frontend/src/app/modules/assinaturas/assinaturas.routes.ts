import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout.component';

export const ASSINATURAS_ROUTES: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: '', pathMatch: 'full', redirectTo: 'checkout' }
];
