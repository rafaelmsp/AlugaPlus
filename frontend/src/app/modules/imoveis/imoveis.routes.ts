import { Routes } from '@angular/router';
import { ImovelListComponent } from './components/imovel-list.component';
import { ImovelFormComponent } from './components/imovel-form.component';

export const IMOVEIS_ROUTES: Routes = [
  {
    path: '',
    component: ImovelListComponent
  },
  {
    path: 'novo',
    component: ImovelFormComponent
  },
  {
    path: 'editar/:id',
    component: ImovelFormComponent
  }
];
























