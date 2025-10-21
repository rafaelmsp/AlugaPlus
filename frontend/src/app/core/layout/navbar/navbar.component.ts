import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavUser {
  nome?: string;
  email?: string;
  role?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-surface border-b border-primary/30 flex items-center px-6 justify-between">
      <div class="text-lg font-semibold tracking-wide text-primary">
        AlugaPlus CRM Pro
      </div>
      <div class="flex items-center gap-4" *ngIf="user">
        <div class="text-sm text-gray-300">
          <div class="font-semibold text-white">{{ user.nome || 'Usuario' }}</div>
          <div class="text-xs text-gray-400">{{ user.email }}</div>
        </div>
        <button
          class="btn-outline text-sm"
          type="button"
          (click)="logout.emit()">
          Sair
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() user: NavUser | null = null;
  @Output() logout = new EventEmitter<void>();
}
























