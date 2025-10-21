import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="space-y-6">
      <section class="grid gap-4 md:grid-cols-4">
        <article class="card">
          <h3 class="text-sm text-gray-400">Total de imoveis</h3>
          <p class="text-2xl font-semibold text-primary mt-2">{{ summary().totalImoveis }}</p>
        </article>
        <article class="card">
          <h3 class="text-sm text-gray-400">Contratos ativos</h3>
          <p class="text-2xl font-semibold text-primary mt-2">{{ summary().contratosAtivos }}</p>
        </article>
        <article class="card">
          <h3 class="text-sm text-gray-400">Receitas no mAas</h3>
          <p class="text-2xl font-semibold text-emerald-400 mt-2">
            {{ summary().totalReceitasMes | currency:'BRL':'symbol':'1.0-2' }}
          </p>
        </article>
        <article class="card">
          <h3 class="text-sm text-gray-400">Despesas no mAas</h3>
          <p class="text-2xl font-semibold text-rose-400 mt-2">
            {{ summary().totalDespesasMes | currency:'BRL':'symbol':'1.0-2' }}
          </p>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <article class="card">
          <h3 class="text-lg font-semibold mb-4">Fluxo de caixa</h3>
          <canvas baseChart
                  [data]="lineChartData"
                  [options]="lineChartOptions"
                  [type]="'line'">
          </canvas>
        </article>

        <article class="card">
          <h3 class="text-lg font-semibold mb-4">Composicao de despesas</h3>
          <canvas baseChart
                  [data]="pieChartData"
                  [options]="pieChartOptions"
                  [type]="'pie'">
          </canvas>
        </article>
      </section>

      <section class="card">
        <h3 class="text-lg font-semibold mb-4">Receitas x Despesas</h3>
        <canvas baseChart
                [data]="barChartData"
                [options]="barChartOptions"
                [type]="'bar'">
        </canvas>
      </section>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notification = inject(NotificationService);

  readonly summary = signal({
    totalImoveis: 0,
    contratosAtivos: 0,
    totalReceitasMes: 0,
    totalDespesasMes: 0
  });

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Receitas',
        data: [],
        borderColor: '#2ea043',
        backgroundColor: 'rgba(46, 160, 67, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Despesas',
        data: [],
        borderColor: '#f85149',
        backgroundColor: 'rgba(248, 81, 73, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { labels: { color: '#c9d1d9' } } },
    scales: {
      x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
      y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } }
    }
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#1f6feb', '#2ea043', '#f85149', '#a371f7', '#d29922']
    }]
  };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { color: '#c9d1d9' } } }
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Receitas',
        data: [],
        backgroundColor: '#2ea043'
      },
      {
        label: 'Despesas',
        data: [],
        backgroundColor: '#f85149'
      }
    ]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { labels: { color: '#c9d1d9' } } },
    scales: {
      x: { ticks: { color: '#8b949e' }, grid: { display: false } },
      y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } }
    }
  };

  ngOnInit(): void {
    this.loadSummary();
    this.loadCharts();
  }

  private loadSummary(): void {
    this.dashboardService.loadSummary().subscribe({
      next: summary => this.summary.set(summary),
      error: () => this.notification.error('Nao foi possivel carregar os indicadores.')
    });
  }

  private loadCharts(): void {
    this.dashboardService.loadChartData().subscribe({
      next: (data: any) => {
        const labels = data?.labels ?? [];
        const receitas = data?.receitas ?? [];
        const despesas = data?.despesas ?? [];
        const categorias = data?.categorias ?? [];
        const valoresCategoria = data?.valoresCategoria ?? [];

        this.lineChartData = {
          ...this.lineChartData,
          labels,
          datasets: [
            { ...this.lineChartData.datasets[0], data: receitas },
            { ...this.lineChartData.datasets[1], data: despesas }
          ]
        };

        this.barChartData = {
          ...this.barChartData,
          labels,
          datasets: [
            { ...this.barChartData.datasets[0], data: receitas },
            { ...this.barChartData.datasets[1], data: despesas }
          ]
        };

        this.pieChartData = {
          ...this.pieChartData,
          labels: categorias,
          datasets: [{ ...this.pieChartData.datasets[0], data: valoresCategoria }]
        };
      },
      error: () => this.notification.warning('Nao foi possivel montar os graficos.')
    });
  }
}

























