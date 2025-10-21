import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrediosService } from '../services/predios.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Predio } from '../../../core/models/predio.model';

@Component({
  standalone: true,
  selector: 'app-predio-list',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Predios</h1>
          <p class="text-sm text-gray-400">Cadastro de empreendimentos e unidades.</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="add()" class="card grid gap-3 md:grid-cols-6">
          <div class="md:col-span-2">
            <label class="text-xs text-gray-400 block mb-1">Nome</label>
            <input formControlName="nome" class="input-control">
          </div>
          <div class="md:col-span-2">
            <label class="text-xs text-gray-400 block mb-1">Endereco</label>
            <input formControlName="endereco" class="input-control">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Unidades</label>
            <input type="number" formControlName="numeroUnidades" class="input-control" min="0">
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Sindico</label>
            <input formControlName="sindico" class="input-control">
          </div>
          <div class="md:col-span-2">
            <label class="text-xs text-gray-400 block mb-1">Contato</label>
            <input formControlName="contato" class="input-control">
          </div>
          <div class="md:col-span-5">
            <label class="text-xs text-gray-400 block mb-1">Observacoes</label>
            <textarea formControlName="observacoes" rows="1" class="input-control"></textarea>
          </div>
          <div class="flex items-center justify-end">
            <button class="btn-primary text-sm h-11 md:self-center w-full" type="submit" [disabled]="pending()">
              {{ pending() ? 'Adicionando...' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="loading()" class="text-center text-gray-400 py-6">
        Carregando predios...
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" *ngIf="!loading() && predios().length">
        <div class="card space-y-3" *ngFor="let predio of predios()">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-semibold text-primary">{{ predio.nome }}</h3>
            <span class="text-xs text-gray-400">#{{ predio.id }}</span>
          </div>
          <p class="text-sm text-gray-400">{{ predio.endereco }}</p>
          <p class="text-sm text-gray-300">Unidades: {{ predio.numeroUnidades || 0 }}</p>
          <p class="text-sm text-gray-300">Sindico: {{ predio.sindico || 'Nao informado' }}</p>
          <p class="text-sm text-gray-300" *ngIf="predio.contato">Contato: {{ predio.contato }}</p>
          <p class="text-sm text-gray-400" *ngIf="predio.observacoes">{{ predio.observacoes }}</p>
          <div class="flex justify-end">
            <button
              class="btn-outline text-xs px-3 py-1 border-rose-400 text-rose-400 hover:bg-rose-500/10"
              type="button"
              (click)="remove(predio.id)"
              [disabled]="removingId() === predio.id">
              {{ removingId() === predio.id ? 'Removendo...' : 'Remover' }}
            </button>
          </div>
        </div>
      </div>

      <p *ngIf="!loading() && !predios().length" class="text-center text-gray-500 py-6">
        Nenhum predio cadastrado ate o momento.
      </p>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
  `]
})
export class PredioListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PrediosService);
  private readonly notification = inject(NotificationService);

  readonly predios = signal<Predio[]>([]);
  readonly loading = signal<boolean>(false);
  readonly pending = signal<boolean>(false);
  readonly removingId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    numeroUnidades: [0, [Validators.required, Validators.min(0)]],
    sindico: [''],
    contato: [''],
    observacoes: ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: data => {
        this.predios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Nao foi possivel carregar os predios.');
      }
    });
  }

  add(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    const value = this.form.getRawValue();
    const payload: Predio = {
      nome: value.nome,
      endereco: value.endereco,
      numeroUnidades: Number(value.numeroUnidades),
      sindico: value.sindico || undefined,
      contato: value.contato || undefined,
      observacoes: value.observacoes || undefined
    };
    this.service.create(payload).subscribe({
      next: () => {
        this.notification.success('Predio cadastrado com sucesso.');
        this.form.reset({
          nome: '',
          endereco: '',
          numeroUnidades: 0,
          sindico: '',
          contato: '',
          observacoes: ''
        });
        this.pending.set(false);
        this.load();
      },
      error: () => {
        this.pending.set(false);
        this.notification.error('Falha ao cadastrar o predio.');
      }
    });
  }

  remove(id?: number): void {
    if (!id || this.removingId() === id) {
      return;
    }
    this.removingId.set(id);
    this.service.remove(id).subscribe({
      next: () => {
        this.notification.success('Predio removido com sucesso.');
        this.removingId.set(null);
        this.load();
      },
      error: () => {
        this.removingId.set(null);
        this.notification.error('Falha ao remover o predio.');
      }
    });
  }
}
























