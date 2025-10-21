import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

interface MovimentoResumo {
  id: number;
  data: string;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  descricao: string;
  valor: number;
  status: string;
}

@Component({
  standalone: true,
  selector: 'app-financeiro',
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Fluxo financeiro</h1>
          <p class="text-sm text-gray-400">Receitas, despesas e previsao de caixa.</p>
        </div>
        <form [formGroup]="filters" class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select formControlName="tipo" class="input-control">
            <option value="">Todos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
          </select>
          <input type="month" formControlName="periodo" class="input-control">
          <input type="text" formControlName="categoria" class="input-control" placeholder="Categoria">
          <input type="text" formControlName="imovel" class="input-control" placeholder="Imovel">
        </form>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <article class="card">
          <h3 class="text-lg font-semibold mb-4">Receitas x Despesas</h3>
          <canvas baseChart [type]="'bar'" [data]="barData" [options]="chartOptions"></canvas>
        </article>
        <article class="card">
          <h3 class="text-lg font-semibold mb-4">Distribuicao por categoria</h3>
          <canvas baseChart [type]="'doughnut'" [data]="pieData" [options]="chartOptions"></canvas>
        </article>
      </div>

      <article class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Data</th>
              <th class="py-2">Tipo</th>
              <th class="py-2">Categoria</th>
              <th class="py-2">Descricao</th>
              <th class="py-2">Valor</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let mov of movimentos()" class="border-b border-primary/10">
              <td class="py-2">{{ mov.data | date:'shortDate' }}</td>
              <td class="py-2">
                <span class="px-2 py-1 rounded-full text-xs"
                      [ngClass]="mov.tipo === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'">
                  {{ mov.tipo }}
                </span>
              </td>
              <td class="py-2">{{ mov.categoria }}</td>
              <td class="py-2">{{ mov.descricao }}</td>
              <td class="py-2">{{ mov.valor | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-2">{{ mov.status }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
  `]
})
export class FinanceiroComponent {
  private readonly fb = new FormBuilder();

  readonly filters = this.fb.nonNullable.group({
    tipo: [''],
    periodo: [''],
    categoria: [''],
    imovel: ['']
  });

  readonly movimentos = signal<MovimentoResumo[]>([
    {
      id: 1,
      data: new Date().toISOString(),
      tipo: 'RECEITA',
      categoria: 'Aluguel',
      descricao: 'Contrato #1',
      valor: 3200,
      status: 'CONFIRMADO'
    },
    {
      id: 2,
      data: new Date().toISOString(),
      tipo: 'DESPESA',
      categoria: 'Manutencao',
      descricao: 'Reparo electrico',
      valor: 450,
      status: 'PENDENTE'
    }
  ]);

  readonly barData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr'],
    datasets: [
      { label: 'Receitas', data: [12000, 11800, 12400, 13000], backgroundColor: '#2ea043' },
      { label: 'Despesas', data: [8000, 7600, 9200, 8800], backgroundColor: '#f85149' }
    ]
  };

  readonly pieData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Aluguel', 'Multa', 'Servicos', 'IPTU'],
    datasets: [
      {
        data: [60, 10, 20, 10],
        backgroundColor: ['#1f6feb', '#2ea043', '#f85149', '#a371f7']
      }
    ]
  };

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { labels: { color: '#c9d1d9' } } },
    scales: {
      x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
      y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } }
    }
  };
}
























