import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanosService } from '../../../core/services/planos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Plano } from '../../../core/models/plano.model';

@Component({
  standalone: true,
  selector: 'app-plano-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">
        {{ editing ? 'Editar plano' : 'Novo plano' }}
      </h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Nome</label>
          <input formControlName="nome" class="input-control">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Descrição</label>
          <textarea formControlName="descricao" rows="3" class="input-control"></textarea>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Valor mensal (R$)</label>
          <input formControlName="valorMensal" type="number" class="input-control" min="0" step="0.01">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Limite de usuários</label>
          <input formControlName="qtdeUsuarios" type="number" class="input-control" min="0">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Limite de imóveis</label>
          <input formControlName="qtdeImoveis" type="number" class="input-control" min="0">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Limite de contratos</label>
          <input formControlName="qtdeContratos" type="number" class="input-control" min="0">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Recursos extras</label>
          <textarea formControlName="recursosExtras" rows="3" class="input-control"></textarea>
        </div>
        <div class="md:col-span-2 flex items-center gap-2">
          <input id="ativo" type="checkbox" formControlName="ativo" class="w-4 h-4">
          <label for="ativo" class="text-sm text-gray-300">Plano ativo</label>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button class="btn-outline" type="button" (click)="router.navigate(['/admin/planos'])">Cancelar</button>
          <button class="btn-primary" type="submit" [disabled]="form.invalid || pending">Salvar</button>
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
export class PlanoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly planosService = inject(PlanosService);
  private readonly notification = inject(NotificationService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    descricao: [''],
    valorMensal: [0, [Validators.required, Validators.min(0)]],
    qtdeUsuarios: [null as number | null],
    qtdeImoveis: [null as number | null],
    qtdeContratos: [null as number | null],
    recursosExtras: [''],
    ativo: [true]
  });

  editing = false;
  pending = false;
  private planoId?: number;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'novo') {
      this.editing = true;
      this.planoId = Number(idParam);
      this.planosService.find(this.planoId).subscribe({
        next: plano => this.form.patchValue(this.toFormValue(plano)),
        error: () => this.notification.error('Não foi possível carregar o plano.')
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending = true;
    const payload = this.form.getRawValue() as Plano;
    const request = this.editing && this.planoId
      ? this.planosService.update(this.planoId, payload)
      : this.planosService.create(payload);
    request.subscribe({
      next: () => {
        this.pending = false;
        this.notification.success('Plano salvo com sucesso.');
        this.router.navigate(['/admin/planos']);
      },
      error: () => {
        this.pending = false;
        this.notification.error('Erro ao salvar o plano.');
      }
    });
  }

  private toFormValue(plano: Plano) {
    return {
      nome: plano.nome,
      descricao: plano.descricao ?? '',
      valorMensal: plano.valorMensal,
      qtdeUsuarios: plano.qtdeUsuarios ?? null,
      qtdeImoveis: plano.qtdeImoveis ?? null,
      qtdeContratos: plano.qtdeContratos ?? null,
      recursosExtras: plano.recursosExtras ?? '',
      ativo: plano.ativo
    };
  }
}
