import { Routes } from '@angular/router';
import { ManutencaoListComponent } from './components/manutencao-list.component';
import { ManutencaoFormComponent } from './components/manutencao-form.component';

export const MANUTENCOES_ROUTES: Routes = [
  {
    path: '',
    component: ManutencaoListComponent
  },
  {
    path: 'nova',
    component: ManutencaoFormComponent
  },
  {
    path: 'editar/:id',
    component: ManutencaoFormComponent
  }
];
























