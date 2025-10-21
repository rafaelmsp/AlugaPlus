import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

interface ContaPredioResumo {
  id: number;
  tipo: string;
  valor: number;
  vencimento: string;
  status: string;
  recorrente: boolean;
}

@Component({
  standalone: true,
  selector: 'app-conta-predio-list',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Contas do predio</h1>
          <p class="text-sm text-gray-400">Despesas operacionais, utilidades e tributos.</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="add()" class="card flex flex-col md:flex-row md:items-end gap-3">
          <div class="w-full md:w-48">
            <label class="text-xs text-gray-400 block mb-1">Tipo</label>
            <select formControlName="tipo" class="input-control">
              <option value="AGUA">Agua</option>
              <option value="LUZ">Luz</option>
              <option value="GAS">Gas</option>
              <option value="IPTU">IPTU</option>
              <option value="LIMPEZA">Limpeza</option>
            </select>
          </div>
          <div class="w-full md:w-32">
            <label class="text-xs text-gray-400 block mb-1">Valor</label>
            <input type="number" formControlName="valor" class="input-control">
          </div>
          <div class="w-full md:w-40">
            <label class="text-xs text-gray-400 block mb-1">Vencimento</label>
            <input type="date" formControlName="vencimento" class="input-control">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" formControlName="recorrente" class="h-4 w-4">
            <label class="text-xs text-gray-400">Recorrente</label>
          </div>
          <button class="btn-primary text-sm h-11 md:self-center" type="submit">Lancar</button>
        </form>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Tipo</th>
              <th class="py-2">Valor</th>
              <th class="py-2">Vencimento</th>
              <th class="py-2">Status</th>
              <th class="py-2">Recorrente</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let conta of contas()" class="border-b border-primary/10">
              <td class="py-2">{{ conta.tipo }}</td>
              <td class="py-2">{{ conta.valor | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-2">{{ conta.vencimento | date:'shortDate' }}</td>
              <td class="py-2">{{ conta.status }}</td>
              <td class="py-2">{{ conta.recorrente ? 'Sim' : 'Nao' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
  `]
})
export class ContaPredioListComponent {
  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    tipo: ['AGUA'],
    valor: [0],
    vencimento: [''],
    recorrente: [false]
  });

  readonly contas = signal<ContaPredioResumo[]>([
    { id: 1, tipo: 'AGUA', valor: 1200, vencimento: new Date().toISOString(), status: 'PENDENTE', recorrente: true },
    { id: 2, tipo: 'LUZ', valor: 940, vencimento: new Date().toISOString(), status: 'PAGO', recorrente: true }
  ]);

  add(): void {
    const value = this.form.getRawValue();
    const conta: ContaPredioResumo = {
      id: this.contas().length + 1,
      tipo: value.tipo,
      valor: Number(value.valor),
      vencimento: value.vencimento || new Date().toISOString(),
      status: 'PENDENTE',
      recorrente: value.recorrente
    };
    this.contas.set([conta, ...this.contas()]);
  }
}
























