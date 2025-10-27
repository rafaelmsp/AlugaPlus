import { Component, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  imports: [CommonModule, RouterLink, NgClass, ReactiveFormsModule],
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
              <th class="py-2 text-right">Acoes</th>
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
              <td class="py-2 text-right">
                <button type="button" class="text-xs text-primary hover:underline" (click)="startEdit(item)">Editar</button>
              </td>
            </tr>
            <tr *ngIf="!manutencoes().length">
              <td colspan="7" class="py-4 text-center text-gray-400">Nenhuma manutencao cadastrada</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div *ngIf="editingId" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-neutral border border-primary/30 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-primary">Editar manutencao</h2>
            <p class="text-xs text-gray-400">Atualize dados do chamado selecionado.</p>
          </div>
          <button class="text-gray-400 hover:text-white" type="button" (click)="closeEditor()">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="saveEdit()" class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-400 block mb-1">Imovel</label>
            <input formControlName="imovel" class="input-control">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Responsavel</label>
            <input formControlName="responsavel" class="input-control">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Custo</label>
            <input type="number" formControlName="custo" class="input-control">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Status</label>
            <select formControlName="status" class="input-control">
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluida</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Data solicitacao</label>
            <input type="date" formControlName="dataSolicitacao" class="input-control">
          </div>
          <div class="md:col-span-2">
            <label class="text-xs text-gray-400 block mb-1">Descricao</label>
            <textarea rows="3" formControlName="descricao" class="input-control"></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2">
            <button type="button" class="btn-secondary" (click)="closeEditor()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="form.invalid">Salvar alteracoes</button>
          </div>
        </form>
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
export class ManutencaoListComponent {
  private readonly fb = new FormBuilder();

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

  readonly form = this.fb.nonNullable.group({
    imovel: ['', Validators.required],
    descricao: ['', Validators.required],
    responsavel: [''],
    custo: [0],
    status: ['PENDENTE', Validators.required],
    dataSolicitacao: ['', Validators.required]
  });

  editingId: number | null = null;

  startEdit(item: ManutencaoResumo): void {
    this.editingId = item.id;
    this.form.setValue({
      imovel: item.imovel,
      descricao: item.descricao,
      responsavel: item.responsavel ?? '',
      custo: item.custo ?? 0,
      status: item.status,
      dataSolicitacao: item.dataSolicitacao.substring(0, 10)
    });
  }

  saveEdit(): void {
    if (this.form.invalid || !this.editingId) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.manutencoes.set(
      this.manutencoes().map(item =>
        item.id === this.editingId
          ? {
              ...item,
              imovel: value.imovel,
              descricao: value.descricao,
              responsavel: value.responsavel || undefined,
              custo: Number(value.custo) || undefined,
              status: value.status,
              dataSolicitacao: value.dataSolicitacao
            }
          : item
      )
    );

    this.closeEditor();
  }

  closeEditor(): void {
    this.editingId = null;
    this.form.reset({ imovel: '', descricao: '', responsavel: '', custo: 0, status: 'PENDENTE', dataSolicitacao: '' });
  }
}
