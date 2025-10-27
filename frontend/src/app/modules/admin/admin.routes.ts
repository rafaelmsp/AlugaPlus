import { Routes } from '@angular/router';
import { PlanosListComponent } from './components/planos-list.component';
import { PlanoFormComponent } from './components/plano-form.component';
import { AssinaturasListComponent } from './components/assinaturas-list.component';
import { AssinaturaDetalheComponent } from './components/assinatura-detalhe.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'planos',
    children: [
      { path: '', component: PlanosListComponent },
      { path: 'novo', component: PlanoFormComponent },
      { path: ':id', component: PlanoFormComponent }
    ]
  },
  {
    path: 'assinaturas',
    children: [
      { path: '', component: AssinaturasListComponent },
      { path: ':id', component: AssinaturaDetalheComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'planos' }
];
