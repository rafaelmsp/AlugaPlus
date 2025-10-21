import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-relatorio',
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-primary">Relatorios gerenciais</h1>
        <p class="text-sm text-gray-400">Exporte dados em PDF e Excel com filtros personalizados.</p>
      </div>

      <section class="card space-y-4">
        <h2 class="text-lg font-semibold">Relatorio financeiro</h2>
        <div class="flex flex-wrap gap-3">
          <button class="btn-primary" type="button" (click)="exportar('pdf')">
            Exportar PDF
          </button>
          <button class="btn-outline" type="button" (click)="exportar('excel')">
            Exportar Excel
          </button>
        </div>
        <p class="text-xs text-gray-500">
          Os relatorios incluem receitas, despesas, contratos e inadimplencias agrupadas por periodo.
        </p>
      </section>

      <section class="card space-y-4">
        <h2 class="text-lg font-semibold">Historico de exportacoes</h2>
        <ul class="space-y-2 text-sm text-gray-400">
          <li *ngFor="let item of historico()">
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  `
})
export class RelatorioComponent {
  private readonly api = inject(ApiService);
  private readonly notification = inject(NotificationService);

  readonly historico = signal<string[]>([]);

  exportar(tipo: 'pdf' | 'excel'): void {
    const endpoint = tipo === 'pdf'
      ? '/relatorios/financeiro/pdf'
      : '/relatorios/financeiro/excel';
    this.api.download(endpoint).subscribe({
      next: blob => {
        const fileType = tipo === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const file = new Blob([blob], { type: fileType });
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = tipo === 'pdf' ? 'relatorio-financeiro.pdf' : 'relatorio-financeiro.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.notification.success(`Relatorio ${tipo.toUpperCase()} gerado com sucesso.`);
        this.historico.set([
          `${new Date().toLocaleString()} - exportado ${tipo.toUpperCase()}`,
          ...this.historico()
        ]);
      },
      error: () => this.notification.error('Falha ao gerar relatorio.')
    });
  }
}
























