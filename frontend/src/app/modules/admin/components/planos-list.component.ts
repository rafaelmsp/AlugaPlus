import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanosService } from '../../../core/services/planos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Plano } from '../../../core/models/plano.model';

@Component({
  standalone: true,
  selector: 'app-planos-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Planos da Plataforma</h1>
          <p class="text-sm text-gray-400">Gerencie planos, limites e recursos disponíveis.</p>
        </div>
        <a routerLink="novo" class="btn-primary text-sm w-full md:w-auto text-center">Novo Plano</a>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-3">Nome</th>
              <th class="py-3">Valor</th>
              <th class="py-3">Limites</th>
              <th class="py-3">Status</th>
              <th class="py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let plano of planos()" class="border-b border-primary/10">
              <td class="py-3">
                <div class="font-semibold text-white">{{ plano.nome }}</div>
                <div class="text-xs text-gray-400">{{ plano.descricao || 'Sem descrição' }}</div>
              </td>
              <td class="py-3">{{ plano.valorMensal | currency:'BRL':'symbol':'1.2-2' }}</td>
              <td class="py-3">
                <div class="text-xs text-gray-300">Usuários: {{ plano.qtdeUsuarios ?? 'Ilimitado' }}</div>
                <div class="text-xs text-gray-300">Imóveis: {{ plano.qtdeImoveis ?? 'Ilimitado' }}</div>
                <div class="text-xs text-gray-300">Contratos: {{ plano.qtdeContratos ?? 'Ilimitado' }}</div>
              </td>
              <td class="py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  [ngClass]="plano.ativo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                  {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="py-3 text-right flex gap-2 justify-end">
                <a [routerLink]="[plano.id]" class="btn-outline text-xs px-3 py-1">Editar</a>
                <button
                  class="btn-outline text-xs px-3 py-1 border-rose-400 text-rose-400 hover:bg-rose-500/10"
                  [disabled]="!plano.ativo"
                  (click)="desativar(plano)">
                  Desativar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!planos().length" class="text-center text-gray-500 py-6">
          Nenhum plano cadastrado.
        </p>
      </div>
    </div>
  `
})
export class PlanosListComponent implements OnInit {
  private readonly planosService = inject(PlanosService);
  private readonly notification = inject(NotificationService);

  readonly planos = signal<Plano[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.planosService.listAdmin().subscribe({
      next: page => this.planos.set(page.content ?? []),
      error: () => this.notification.error('Não foi possível carregar os planos.')
    });
  }

  desativar(plano: Plano): void {
    if (!plano.id) {
      return;
    }
    const confirmacao = confirm(`Deseja desativar o plano ${plano.nome}?`);
    if (!confirmacao) {
      return;
    }
    this.planosService.deactivate(plano.id).subscribe({
      next: () => {
        this.notification.success('Plano desativado com sucesso.');
        this.load();
      },
      error: () => this.notification.error('Não foi possível desativar o plano.')
    });
  }
}
