import { Routes } from '@angular/router';
import { InquilinoListComponent } from './components/inquilino-list.component';
import { InquilinoFormComponent } from './components/inquilino-form.component';

export const INQUILINOS_ROUTES: Routes = [
  {
    path: '',
    component: InquilinoListComponent
  },
  {
    path: 'novo',
    component: InquilinoFormComponent
  },
  {
    path: 'editar/:id',
    component: InquilinoFormComponent
  }
];
























