import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PagamentoListComponent } from './pagamento-list.component';

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
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!contratos().length" class="text-center text-gray-500 py-6">
          Nenhum contrato cadastrado.
        </p>
      </div>

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
export class ContratoListComponent {
  readonly contratos = signal<ContratoResumo[]>([
    {
      id: 1,
      inquilino: 'Fulano de Tal',
      imovel: 'Av. Paulista, 1000 - Apto 101',
      status: 'ATIVO',
      dataInicio: new Date().toISOString(),
      valorMensal: 3500,
      arquivoPdf: '/assets/mock/contrato.pdf',
      pagamentos: [
        { id: 1, vencimento: new Date().toISOString(), valor: 3500, status: 'PENDENTE' },
        { id: 2, vencimento: new Date().toISOString(), valor: 3500, status: 'PAGO', dataPagamento: new Date().toISOString() }
      ]
    }
  ]);

  readonly selected = signal<ContratoResumo | null>(null);

  preview(contrato: ContratoResumo): void {
    this.selected.set(contrato);
  }

  close(): void {
    this.selected.set(null);
  }
}
























