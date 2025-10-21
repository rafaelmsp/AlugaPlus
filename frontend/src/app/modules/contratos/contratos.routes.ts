import { Routes } from '@angular/router';
import { ContratoListComponent } from './components/contrato-list.component';
import { ContratoFormComponent } from './components/contrato-form.component';

export const CONTRATOS_ROUTES: Routes = [
  {
    path: '',
    component: ContratoListComponent
  },
  {
    path: 'novo',
    component: ContratoFormComponent
  },
  {
    path: 'editar/:id',
    component: ContratoFormComponent
  }
];
























