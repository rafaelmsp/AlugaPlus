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

interface ContaCategoria {
  id: number;
  nome: string;
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
        <form [formGroup]="form" (ngSubmit)="save()" class="card flex flex-col md:flex-row md:items-end gap-3">
          <div class="w-full md:w-48">
            <label class="text-xs text-gray-400 block mb-1">Tipo</label>
            <select formControlName="tipo" class="input-control">
              <option *ngFor="let tipo of categorias()" [value]="tipo.nome">{{ tipo.nome }}</option>
            </select>
            <button type="button" class="text-xs text-primary mt-1 hover:underline" (click)="toggleCategoriaManager(true)">
              Gerenciar tipos
            </button>
          </div>
          <div class="w-full md:w-32">
            <label class="text-xs text-gray-400 block mb-1">Valor</label>
            <input type="number" formControlName="valor" class="input-control">
          </div>
          <div class="w-full md:w-40">
            <label class="text-xs text-gray-400 block mb-1">Vencimento</label>
            <input type="date" formControlName="vencimento" class="input-control">
          </div>
          <div class="w-full md:w-40">
            <label class="text-xs text-gray-400 block mb-1">Status</label>
            <select formControlName="status" class="input-control">
              <option *ngFor="let option of statusOptions" [value]="option">{{ option }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" formControlName="recorrente" class="h-4 w-4">
            <label class="text-xs text-gray-400">Recorrente</label>
          </div>
          <div class="flex gap-2">
            <button class="btn-primary text-sm h-11 md:self-center" type="submit">
              {{ editingId ? 'Salvar' : 'Lancar' }}
            </button>
            <button *ngIf="editingId" type="button" class="btn-secondary text-sm h-11" (click)="resetForm()">Cancelar</button>
          </div>
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
              <th class="py-2 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let conta of contas()" class="border-b border-primary/10">
              <td class="py-2">{{ conta.tipo }}</td>
              <td class="py-2">{{ conta.valor | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-2">{{ conta.vencimento | date:'shortDate' }}</td>
              <td class="py-2">{{ conta.status }}</td>
              <td class="py-2">{{ conta.recorrente ? 'Sim' : 'Nao' }}</td>
              <td class="py-2 text-right space-x-2">
                <button type="button" class="text-xs text-primary hover:underline" (click)="startEdit(conta)">Editar</button>
                <button type="button" class="text-xs text-error hover:underline" (click)="remove(conta.id)">Remover</button>
              </td>
            </tr>
            <tr *ngIf="!contas().length">
              <td colspan="6" class="py-4 text-center text-gray-400">Nenhuma conta cadastrada</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div *ngIf="showCategoriaManager" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-neutral border border-primary/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-primary">Tipos de conta</h2>
            <p class="text-xs text-gray-400">Adicione, edite ou remova categorias.</p>
          </div>
          <button class="text-gray-400 hover:text-white" type="button" (click)="toggleCategoriaManager(false)">&times;</button>
        </div>

        <form [formGroup]="categoriaForm" (ngSubmit)="saveCategoria()" class="flex flex-col md:flex-row gap-3">
          <input type="text" formControlName="nome" class="input-control" placeholder="Ex.: Internet" />
          <div class="flex gap-2">
            <button class="btn-primary text-sm" type="submit">{{ categoriaEditandoId ? 'Salvar' : 'Adicionar' }}</button>
            <button *ngIf="categoriaEditandoId" type="button" class="btn-secondary text-sm" (click)="resetCategoriaForm()">Cancelar</button>
          </div>
        </form>

        <div class="max-h-60 overflow-y-auto divide-y divide-primary/20">
          <div *ngFor="let categoria of categorias()" class="flex items-center justify-between py-2">
            <span>{{ categoria.nome }}</span>
            <div class="space-x-3 text-xs">
              <button type="button" class="text-primary hover:underline" (click)="editarCategoria(categoria)">Editar</button>
              <button type="button" class="text-error hover:underline" (click)="removerCategoria(categoria.id)">Excluir</button>
            </div>
          </div>
          <p *ngIf="!categorias().length" class="text-center text-gray-400 py-4">Nenhum tipo cadastrado.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
    .btn-secondary {
      @apply bg-transparent border border-primary/60 text-white rounded-lg px-4 hover:bg-primary/10 transition;
    }
  `]
})
export class ContaPredioListComponent {
  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    tipo: ['AGUA'],
    valor: [0],
    vencimento: [''],
    status: ['PENDENTE'],
    recorrente: [false]
  });

  readonly contas = signal<ContaPredioResumo[]>([
    { id: 1, tipo: 'AGUA', valor: 1200, vencimento: new Date().toISOString(), status: 'PENDENTE', recorrente: true },
    { id: 2, tipo: 'LUZ', valor: 940, vencimento: new Date().toISOString(), status: 'PAGO', recorrente: true }
  ]);

  readonly categorias = signal<ContaCategoria[]>([
    { id: 1, nome: 'AGUA' },
    { id: 2, nome: 'LUZ' },
    { id: 3, nome: 'GAS' },
    { id: 4, nome: 'IPTU' },
    { id: 5, nome: 'LIMPEZA' }
  ]);

  readonly statusOptions: ContaPredioResumo['status'][] = ['PENDENTE', 'PAGO', 'ATRASADO'];
  editingId: number | null = null;
  showCategoriaManager = false;

  readonly categoriaForm = this.fb.nonNullable.group({ nome: [''] });
  categoriaEditandoId: number | null = null;

  save(): void {
    const value = this.form.getRawValue();
    const normalized: ContaPredioResumo = {
      id: this.editingId ?? this.generateId(),
      tipo: value.tipo,
      valor: Number(value.valor),
      vencimento: value.vencimento || new Date().toISOString(),
      status: value.status,
      recorrente: value.recorrente
    };

    if (this.editingId) {
      this.contas.set(this.contas().map(conta => conta.id === this.editingId ? normalized : conta));
    } else {
      this.contas.set([normalized, ...this.contas()]);
    }

    this.resetForm();
  }

  startEdit(conta: ContaPredioResumo): void {
    this.editingId = conta.id;
    this.form.setValue({
      tipo: conta.tipo,
      valor: conta.valor,
      vencimento: conta.vencimento.substring(0, 10),
      status: conta.status,
      recorrente: conta.recorrente
    });
  }

  remove(id: number): void {
    this.contas.set(this.contas().filter(conta => conta.id !== id));
    if (this.editingId === id) {
      this.resetForm();
    }
  }

  resetForm(): void {
    const fallbackTipo = this.categorias()[0]?.nome ?? 'AGUA';
    this.form.reset({ tipo: fallbackTipo, valor: 0, vencimento: '', status: 'PENDENTE', recorrente: false });
    this.editingId = null;
  }

  private generateId(): number {
    return this.contas().reduce((max, conta) => Math.max(max, conta.id), 0) + 1;
  }

  toggleCategoriaManager(show: boolean): void {
    this.showCategoriaManager = show;
    if (!show) {
      this.resetCategoriaForm();
    }
  }

  saveCategoria(): void {
    const nome = this.categoriaForm.controls.nome.value.trim().toUpperCase();
    if (!nome) {
      return;
    }

    const exists = this.categorias().some(cat => cat.nome === nome && cat.id !== this.categoriaEditandoId);
    if (exists) {
      return;
    }

    if (this.categoriaEditandoId) {
      const anterior = this.categorias().find(cat => cat.id === this.categoriaEditandoId)?.nome;
      this.categorias.set(this.categorias().map(cat => cat.id === this.categoriaEditandoId ? { ...cat, nome } : cat));
      if (anterior && anterior !== nome) {
        this.contas.set(this.contas().map(conta => conta.tipo === anterior ? { ...conta, tipo: nome } : conta));
        if (this.form.controls.tipo.value === anterior) {
          this.form.controls.tipo.setValue(nome);
        }
      }
    } else {
      const novo: ContaCategoria = {
        id: this.categorias().reduce((max, cat) => Math.max(max, cat.id), 0) + 1,
        nome
      };
      this.categorias.set([...this.categorias(), novo]);
      if (!this.form.controls.tipo.value) {
        this.form.controls.tipo.setValue(novo.nome);
      }
    }

    this.resetCategoriaForm();
  }

  editarCategoria(categoria: ContaCategoria): void {
    this.categoriaEditandoId = categoria.id;
    this.categoriaForm.setValue({ nome: categoria.nome });
  }

  removerCategoria(id: number): void {
    const categoria = this.categorias().find(cat => cat.id === id);
    if (!categoria) {
      return;
    }
    const emUso = this.contas().some(conta => conta.tipo === categoria.nome);
    if (emUso) {
      return;
    }
    this.categorias.set(this.categorias().filter(cat => cat.id !== id));
    if (this.form.controls.tipo.value === categoria.nome) {
      const fallback = this.categorias()[0]?.nome ?? '';
      this.form.controls.tipo.setValue(fallback);
    }
    if (this.categoriaEditandoId === id) {
      this.resetCategoriaForm();
    }
  }

  resetCategoriaForm(): void {
    this.categoriaForm.reset({ nome: '' });
    this.categoriaEditandoId = null;
  }
}
