import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssinaturasService } from '../../../core/services/assinaturas.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Assinatura } from '../../../core/models/assinatura.model';

@Component({
  standalone: true,
  selector: 'app-assinaturas-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Assinaturas</h1>
          <p class="text-sm text-gray-400">Acompanhe assinaturas ativas, pendentes e canceladas.</p>
        </div>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-3">Usuário</th>
              <th class="py-3">Plano</th>
              <th class="py-3">Status</th>
              <th class="py-3">Forma Pagamento</th>
              <th class="py-3">Início</th>
              <th class="py-3">Fim</th>
              <th class="py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let assinatura of assinaturas()" class="border-b border-primary/10">
              <td class="py-3">#{{ assinatura.usuarioId }}</td>
              <td class="py-3">{{ assinatura.planoNome || ('Plano #' + assinatura.planoId) }}</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {{ assinatura.status }}
                </span>
              </td>
              <td class="py-3">{{ assinatura.formaPagamento }}</td>
              <td class="py-3">{{ assinatura.dataInicio | date:'shortDate' }}</td>
              <td class="py-3">{{ assinatura.dataFim ? (assinatura.dataFim | date:'shortDate') : '-' }}</td>
              <td class="py-3 text-right">
                <a [routerLink]="[assinatura.id]" class="btn-outline text-xs px-3 py-1">Detalhes</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!assinaturas().length" class="text-center text-gray-500 py-6">
          Nenhuma assinatura encontrada.
        </p>
      </div>
    </div>
  `
})
export class AssinaturasListComponent implements OnInit {
  private readonly assinaturasService = inject(AssinaturasService);
  private readonly notification = inject(NotificationService);

  readonly assinaturas = signal<Assinatura[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.assinaturasService.listar().subscribe({
      next: page => this.assinaturas.set(page.content ?? []),
      error: () => this.notification.error('Não foi possível carregar as assinaturas.')
    });
  }
}
