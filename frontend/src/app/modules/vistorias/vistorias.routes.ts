import { Routes } from '@angular/router';
import { VistoriaListComponent } from './components/vistoria-list.component';
import { VistoriaFormComponent } from './components/vistoria-form.component';

export const VISTORIAS_ROUTES: Routes = [
  {
    path: '',
    component: VistoriaListComponent
  },
  {
    path: 'nova',
    component: VistoriaFormComponent
  },
  {
    path: 'editar/:id',
    component: VistoriaFormComponent
  }
];
























