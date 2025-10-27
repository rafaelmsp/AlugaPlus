import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface PagamentoResumo {
  id: number;
  vencimento: string;
  valor: number;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO' | 'CANCELADO' | string;
  dataPagamento?: string;
}

@Component({
  standalone: true,
  selector: 'app-pagamento-list',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-primary">Pagamentos</h3>
        <span class="text-xs text-gray-400">Contrato #{{ contratoId }}</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Vencimento</th>
              <th class="py-2">Valor</th>
              <th class="py-2">Status</th>
              <th class="py-2">Pagamento</th>
              <th *ngIf="acoesHabilitadas" class="py-2 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pagamento of pagamentos()" class="border-b border-primary/10">
              <td class="py-2">{{ pagamento.vencimento | date:'shortDate' }}</td>
              <td class="py-2">{{ pagamento.valor | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-2">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  [ngClass]="{
                    'bg-emerald-500/10 text-emerald-400': pagamento.status === 'PAGO',
                    'bg-amber-500/10 text-amber-400': pagamento.status === 'PENDENTE',
                    'bg-rose-500/10 text-rose-400': pagamento.status === 'ATRASADO',
                    'bg-gray-500/10 text-gray-300': pagamento.status === 'CANCELADO'
                  }">
                  {{ pagamento.status }}
                </span>
              </td>
              <td class="py-2">
                {{ pagamento.dataPagamento ? (pagamento.dataPagamento | date:'shortDate') : '"' }}
              </td>
              <td *ngIf="acoesHabilitadas" class="py-2 text-right space-x-3">
                <button *ngIf="uploadHandler" type="button" class="text-xs text-primary hover:underline" (click)="uploadHandler(pagamento)">
                  Enviar comprovante
                </button>
                <button *ngIf="allowActions" type="button" class="text-xs text-primary hover:underline" (click)="openBaixa(pagamento)">
                  Dar baixa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!pagamentos().length" class="text-sm text-gray-500 py-4 text-center">
          Nao ha pagamentos lancados para este contrato.
        </p>
      </div>
    </div>

    <div *ngIf="allowActions && modalAberto" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-neutral border border-primary/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-semibold text-primary">Dar baixa no pagamento</h4>
          <button class="text-gray-400 hover:text-white" (click)="fecharModal()">&times;</button>
        </div>
        <form [formGroup]="form" (ngSubmit)="confirmarBaixa()" class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">Status</label>
            <select formControlName="status" class="input-control">
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">Data de pagamento</label>
            <input type="date" formControlName="dataPagamento" class="input-control">
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">Observacao</label>
            <textarea formControlName="observacao" rows="2" class="input-control"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="btn-secondary" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Salvando...' : 'Confirmar' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PagamentoListComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  @Input() contratoId?: number;
  @Input() set data(value: PagamentoResumo[] | null) {
    this.pagamentos.set(value ?? []);
  }
  @Input() allowActions = true;
  @Input() uploadHandler?: (pagamento: PagamentoResumo) => void;

  readonly pagamentos = signal<PagamentoResumo[]>([]);

  modalAberto = false;
  loading = false;
  selecionado?: PagamentoResumo;
  readonly form = this.fb.nonNullable.group({
    status: ['PAGO'],
    dataPagamento: [''],
    observacao: ['']
  });

  get acoesHabilitadas(): boolean {
    return this.allowActions || !!this.uploadHandler;
  }

  openBaixa(pag: PagamentoResumo): void {
    if (!this.allowActions) return;
    this.selecionado = pag;
    this.form.reset({
      status: pag.status === 'PAGO' ? 'PAGO' : 'PENDENTE',
      dataPagamento: pag.dataPagamento?.substring(0, 10) ?? '',
      observacao: ''
    });
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.loading = false;
    this.selecionado = undefined;
  }

  confirmarBaixa(): void {
    if (!this.selecionado || !this.allowActions) {
      return;
    }
    const body: any = this.form.getRawValue();
    if (!body.dataPagamento) {
      delete body.dataPagamento;
    }
    this.loading = true;
    this.api.patch(`/pagamentos/${this.selecionado.id}/status`, body).subscribe({
      next: () => {
        this.pagamentos.set(this.pagamentos().map(p => p.id === this.selecionado!.id ? {
          ...p,
          status: body.status,
          dataPagamento: body.status === 'PAGO'
            ? (body.dataPagamento || new Date().toISOString())
            : (body.status === 'PENDENTE' ? undefined : p.dataPagamento)
        } : p));
        this.notification.success('Baixa registrada com sucesso');
        this.fecharModal();
      },
      error: () => {
        this.loading = false;
        this.notification.error('Não foi possível registrar a baixa');
      }
    });
  }
}

