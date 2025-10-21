import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { portalGuard } from './core/guards/portal.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'imoveis',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/imoveis/imoveis.routes').then(m => m.IMOVEIS_ROUTES)
  },
  {
    path: 'inquilinos',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/inquilinos/inquilinos.routes').then(m => m.INQUILINOS_ROUTES)
  },
  {
    path: 'contratos',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/contratos/contratos.routes').then(m => m.CONTRATOS_ROUTES)
  },
  {
    path: 'vistorias',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/vistorias/vistorias.routes').then(m => m.VISTORIAS_ROUTES)
  },
  {
    path: 'financeiro',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/financeiro/financeiro.routes').then(m => m.FINANCEIRO_ROUTES)
  },
  {
    path: 'predios',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/predios/predios.routes').then(m => m.PREDIOS_ROUTES)
  },
  {
    path: 'contas-predio',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/contas-predio/contas-predio.routes').then(m => m.CONTAS_PREDIO_ROUTES)
  },
  {
    path: 'manutencoes',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/manutencoes/manutencoes.routes').then(m => m.MANUTENCOES_ROUTES)
  },
  {
    path: 'relatorios',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/relatorios/relatorios.routes').then(m => m.RELATORIOS_ROUTES)
  },
  {
    path: 'portal',
    canActivate: [portalGuard],
    loadChildren: () => import('./modules/portal-inquilino/portal.routes').then(m => m.PORTAL_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
























