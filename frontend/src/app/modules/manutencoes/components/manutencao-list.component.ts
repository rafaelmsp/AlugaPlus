import { Component, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ManutencaoResumo {
  id: number;
  imovel: string;
  descricao: string;
  responsavel?: string;
  custo?: number;
  status: string;
  dataSolicitacao: string;
}

@Component({
  standalone: true,
  selector: 'app-manutencao-list',
  imports: [CommonModule, RouterLink, NgClass],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Ordens de manutencao</h1>
          <p class="text-sm text-gray-400">Acompanhe status, custos e evidencias.</p>
        </div>
        <a routerLink="nova" class="btn-primary text-sm w-full md:w-auto text-center">Nova manutencao</a>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Imovel</th>
              <th class="py-2">Descricao</th>
              <th class="py-2">Responsavel</th>
              <th class="py-2">Custo</th>
              <th class="py-2">Status</th>
              <th class="py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of manutencoes()" class="border-b border-primary/10">
              <td class="py-2">{{ item.imovel }}</td>
              <td class="py-2">{{ item.descricao }}</td>
              <td class="py-2">{{ item.responsavel || 'Nao definido' }}</td>
              <td class="py-2">{{ item.custo | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-2">
                <span class="px-2 py-1 rounded-full text-xs"
                      [ngClass]="{
                        'bg-amber-500/10 text-amber-400': item.status === 'EM_ANDAMENTO',
                        'bg-emerald-500/10 text-emerald-400': item.status === 'CONCLUIDA',
                        'bg-rose-500/10 text-rose-400': item.status === 'PENDENTE'
                      }">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-2">{{ item.dataSolicitacao | date:'shortDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ManutencaoListComponent {
  readonly manutencoes = signal<ManutencaoResumo[]>([
    {
      id: 1,
      imovel: 'Av. Brasil, 900 - Galpao',
      descricao: 'Reparo em portao automatico',
      responsavel: 'Equipe TechFix',
      custo: 850,
      status: 'EM_ANDAMENTO',
      dataSolicitacao: new Date().toISOString()
    }
  ]);
}
























