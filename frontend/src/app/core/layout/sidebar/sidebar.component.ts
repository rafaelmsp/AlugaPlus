import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden md:flex flex-col w-64 bg-surface border-r border-primary/30 min-h-screen sticky top-0">
      <div class="p-6 border-b border-primary/20">
        <h2 class="text-primary font-semibold text-xl">Painel</h2>
        <p class="text-xs text-gray-400 mt-1">Gerencie imoveis, contratos e financas</p>
      </div>
      <nav class="flex-1 overflow-y-auto p-4 space-y-2">
        <a
          *ngFor="let item of filteredMenu()"
          [routerLink]="item.route"
          routerLinkActive="bg-primary/20 text-primary border border-primary/40"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-primary hover:bg-primary/10 transition">
          <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly userRole = signal(this.authService.getCurrentUser()?.role ?? 'GESTOR');

  readonly menu: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'home', label: 'Imoveis', route: '/imoveis' },
    { icon: 'group', label: 'Inquilinos', route: '/inquilinos' },
    { icon: 'article', label: 'Contratos', route: '/contratos' },
    { icon: 'inventory', label: 'Vistorias', route: '/vistorias' },
    { icon: 'payments', label: 'Financeiro', route: '/financeiro' },
    { icon: 'apartment', label: 'Predios', route: '/predios' },
    { icon: 'receipt_long', label: 'Contas do Predio', route: '/contas-predio' },
    { icon: 'build', label: 'Manutencoes', route: '/manutencoes' },
    { icon: 'summarize', label: 'Relatorios', route: '/relatorios' },
    { icon: 'person', label: 'Portal Inquilino', route: '/portal', roles: ['INQUILINO'] }
  ];

  filteredMenu(): MenuItem[] {
    const role = this.userRole();
    return this.menu.filter(item => !item.roles || item.roles.includes(role));
  }
}

























