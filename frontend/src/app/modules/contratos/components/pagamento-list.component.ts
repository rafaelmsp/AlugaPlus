import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PagamentoResumo {
  id: number;
  vencimento: string;
  valor: number;
  status: string;
  dataPagamento?: string;
}

@Component({
  standalone: true,
  selector: 'app-pagamento-list',
  imports: [CommonModule],
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
                    'bg-rose-500/10 text-rose-400': pagamento.status === 'ATRASADO'
                  }">
                  {{ pagamento.status }}
                </span>
              </td>
              <td class="py-2">
                {{ pagamento.dataPagamento ? (pagamento.dataPagamento | date:'shortDate') : '"' }}
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!pagamentos().length" class="text-sm text-gray-500 py-4 text-center">
          Nao ha pagamentos lancados para este contrato.
        </p>
      </div>
    </div>
  `
})
export class PagamentoListComponent {
  @Input() contratoId?: number;
  @Input() set data(value: PagamentoResumo[] | null) {
    this.pagamentos.set(value ?? []);
  }

  readonly pagamentos = signal<PagamentoResumo[]>([]);
}

























