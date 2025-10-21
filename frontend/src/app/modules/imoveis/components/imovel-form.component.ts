import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImoveisService } from '../services/imoveis.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiService } from '../../../core/services/api.service';
import { Predio } from '../../../core/models/predio.model';

interface PageResponse<T> {
  content: T[];
}

@Component({
  standalone: true,
  selector: 'app-imovel-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">
        {{ editing() ? 'Editar imovel' : 'Novo imovel' }}
      </h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Endereco</label>
          <input formControlName="endereco" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Tipo</label>
          <select formControlName="tipo" class="input-control">
            <option value="APARTAMENTO">Apartamento</option>
            <option value="CASA">Casa</option>
            <option value="SALA_COMERCIAL">Sala Comercial</option>
            <option value="TERRENO">Terreno</option>
            <option value="GALPAO">Galpao</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Valor de aluguel</label>
          <input type="number" formControlName="valorAluguel" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Status</label>
          <select formControlName="status" class="input-control">
            <option value="DISPONIVEL">Disponivel</option>
            <option value="ALUGADO">Alugado</option>
            <option value="MANUTENCAO">Manutencao</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Predio</label>
          <select formControlName="predioId" class="input-control">
            <option [ngValue]="null">Sem predio</option>
            <option *ngFor="let predio of predios()" [value]="predio.id">
              {{ predio.nome }}
            </option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Descricao</label>
          <textarea formControlName="descricao" rows="4" class="input-control"></textarea>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button class="btn-outline" type="button" (click)="router.navigate(['/imoveis'])">
            Cancelar
          </button>
          <button class="btn-primary" type="submit" [disabled]="form.invalid || pending()">
            {{ pending() ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
  `]
})
export class ImovelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ImoveisService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly api = inject(ApiService);

  readonly editing = signal(false);
  readonly pending = signal(false);
  readonly predios = signal<Predio[]>([]);

  readonly form = this.fb.nonNullable.group({
    endereco: ['', Validators.required],
    tipo: ['APARTAMENTO', Validators.required],
    valorAluguel: [0, Validators.required],
    status: ['DISPONIVEL', Validators.required],
    descricao: [''],
    predioId: [null as number | null]
  });

  ngOnInit(): void {
    this.loadPredios();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editing.set(true);
      this.service.find(id).subscribe({
        next: imovel => {
          this.form.patchValue({
            endereco: imovel.endereco,
            tipo: imovel.tipo,
            valorAluguel: imovel.valorAluguel,
            status: imovel.status,
            descricao: imovel.descricao ?? '',
            predioId: imovel.predio?.id ?? null
          });
        },
        error: () => this.notification.error('Nao foi possivel carregar o imovel.')
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload = {
      ...this.form.getRawValue(),
      predioId: this.form.value.predioId
    };
    const request = this.editing()
      ? this.service.update(id, payload)
      : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.pending.set(false);
        this.notification.success('Imovel salvo com sucesso.');
        this.router.navigate(['/imoveis']);
      },
      error: () => {
        this.pending.set(false);
        this.notification.error('Erro ao salvar o imovel.');
      }
    });
  }

  private loadPredios(): void {
    this.api.get<PageResponse<Predio>>('/predios', { size: 1000 }).subscribe({
      next: data => this.predios.set(data.content ?? []),
      error: () => this.notification.warning('Nao foi possivel carregar os predios.')
    });
  }
}

























