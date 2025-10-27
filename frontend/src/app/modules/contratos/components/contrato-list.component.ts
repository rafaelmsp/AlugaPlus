import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { finalize } from 'rxjs';
import { PagamentoListComponent } from './pagamento-list.component';
import { ContratosService } from '../services/contratos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Contrato } from '../../../core/models/contrato.model';
import { environment } from '../../../../environments/environment';

interface PagamentoResumo {
  id: number;
  vencimento: string;
  valor: number;
  status: string;
  dataPagamento?: string;
}

interface ContratoResumo {
  id: number;
  inquilino: string;
  imovel: string;
  status: string;
  valorMensal: number;
  dataInicio: string;
  dataFim?: string;
  arquivoPdf?: string;
  pagamentos?: PagamentoResumo[];
}

@Component({
  standalone: true,
  selector: 'app-contrato-list',
  imports: [CommonModule, RouterLink, NgxExtendedPdfViewerModule, PagamentoListComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Contratos</h1>
          <p class="text-sm text-gray-400">Upload de PDFs, controle de status e vencimentos.</p>
        </div>
        <a routerLink="novo" class="btn-primary text-sm w-full md:w-auto text-center">Novo Contrato</a>
      </div>

      <div class="card overflow-x-auto">
        <ng-container *ngIf="!loading(); else loadingTpl">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
              <tr>
                <th class="py-3">Inquilino</th>
                <th class="py-3">Imovel</th>
                <th class="py-3">Periodo</th>
                <th class="py-3">Valor</th>
                <th class="py-3">Status</th>
                <th class="py-3 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let contrato of contratos()" class="border-b border-primary/10">
                <td class="py-3">{{ contrato.inquilino }}</td>
                <td class="py-3">{{ contrato.imovel }}</td>
                <td class="py-3">
                  {{ contrato.dataInicio | date:'shortDate' }} -
                  {{ contrato.dataFim ? (contrato.dataFim | date:'shortDate') : 'Indeterminado' }}
                </td>
                <td class="py-3">{{ contrato.valorMensal | currency:'BRL':'symbol':'1.0-2' }}</td>
                <td class="py-3">
                  <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {{ contrato.status }}
                  </span>
                </td>
                <td class="py-3 text-right flex gap-2 justify-end">
                  <button class="btn-outline text-xs px-3 py-1" (click)="preview(contrato)">Visualizar</button>
                  <a [routerLink]="['editar', contrato.id]" class="btn-outline text-xs px-3 py-1">Editar</a>
                  <button
                    class="px-3 py-1 text-xs rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                    [disabled]="deleting() === contrato.id"
                    (click)="remove(contrato)">
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="!contratos().length" class="text-center text-gray-500 py-6">
            Nenhum contrato cadastrado.
          </p>
        </ng-container>
      </div>
      <ng-template #loadingTpl>
        <p class="text-center text-gray-500 py-6">Carregando contratos...</p>
      </ng-template>

      <div *ngIf="selected()" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
        <div class="bg-neutral border border-primary/30 rounded-xl w-full max-w-4xl p-4 space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-primary">Contrato #{{ selected()?.id }}</h2>
            <button class="btn-outline text-xs" (click)="close()">Fechar</button>
          </div>
          <ngx-extended-pdf-viewer
            *ngIf="selected()?.arquivoPdf"
            [src]="selected()?.arquivoPdf"
            height="60vh"
            [textLayer]="true"
            [useBrowserLocale]="true">
          </ngx-extended-pdf-viewer>
          <p *ngIf="!selected()?.arquivoPdf" class="text-sm text-gray-400">
            Nenhum PDF associado a este contrato.
          </p>
          <app-pagamento-list
            [contratoId]="selected()?.id"
            [data]="selected()?.pagamentos ?? []">
          </app-pagamento-list>
        </div>
      </div>
    </div>
  `
})
export class ContratoListComponent implements OnInit {
  private readonly contratosService = inject(ContratosService);
  private readonly notification = inject(NotificationService);

  readonly contratos = signal<ContratoResumo[]>([]);
  readonly selected = signal<ContratoResumo | null>(null);
  readonly loading = signal(false);
  readonly deleting = signal<number | null>(null);

  ngOnInit(): void {
    this.loadContratos();
  }

  private loadContratos(): void {
    this.loading.set(true);
    this.contratosService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: contratos => this.contratos.set(contratos.map(c => this.toResumo(c))),
        error: () => this.notification.error('Nao foi possivel carregar os contratos.')
      });
  }

  private toResumo(contrato: Contrato): ContratoResumo {
    return {
      id: contrato.id ?? 0,
      inquilino: contrato.inquilinoNome ?? `Inquilino #${contrato.inquilinoId ?? ''}`,
      imovel: contrato.imovelDescricao ?? `Imovel #${contrato.imovelId ?? ''}`,
      status: contrato.status ?? 'PENDENTE',
      valorMensal: Number(contrato.valorMensal ?? 0),
      dataInicio: contrato.dataInicio,
      dataFim: contrato.dataFim ?? undefined,
      arquivoPdf: this.resolveArquivoPdf(contrato.arquivoPdf),
      pagamentos: []
    };
  }

  preview(contrato: ContratoResumo): void {
    this.selected.set(contrato);
  }

  close(): void {
    this.selected.set(null);
  }

  remove(contrato: ContratoResumo): void {
    if (!contrato.id) {
      return;
    }
    const confirmed = confirm(`Deseja realmente excluir o contrato de ${contrato.inquilino}?`);
    if (!confirmed) {
      return;
    }

    this.deleting.set(contrato.id);
    this.contratosService
      .delete(contrato.id)
      .pipe(finalize(() => this.deleting.set(null)))
      .subscribe({
        next: () => {
          this.notification.success('Contrato removido com sucesso.');
          this.contratos.update(lista => lista.filter(item => item.id !== contrato.id));
          if (this.selected()?.id === contrato.id) {
            this.close();
          }
        },
        error: () => this.notification.error('Nao foi possivel remover o contrato.')
      });
  }

  private resolveArquivoPdf(path?: string | null): string | undefined {
    if (!path) {
      return undefined;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const sanitized = path.startsWith('/') ? path : `/${path}`;
    return `${environment.apiUrl}${sanitized}`;
  }
}
