import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InquilinosService } from '../services/inquilinos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiService } from '../../../core/services/api.service';
import { Usuario } from '../../../core/models/user.model';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  standalone: true,
  selector: 'app-inquilino-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">
        {{ editing() ? 'Editar inquilino' : 'Novo inquilino' }}
      </h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Nome</label>
          <input formControlName="nome" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">CPF</label>
          <input formControlName="cpf" class="input-control" placeholder="000.000.000-00">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Telefone</label>
          <input formControlName="telefone" class="input-control" placeholder="(00) 00000-0000">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Email</label>
          <input formControlName="email" type="email" class="input-control">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Endereco</label>
          <input formControlName="endereco" class="input-control">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">ObservAcoeses</label>
          <textarea formControlName="observacoes" rows="4" class="input-control"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Usuario vinculado</label>
          <select formControlName="usuarioId" class="input-control">
            <option [ngValue]="null">Selecione um usuario</option>
            <option *ngFor="let user of usuarios()" [value]="user.id">
              {{ user.nome }} - {{ user.email }} ({{ user.role }})
            </option>
          </select>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button class="btn-outline" type="button" (click)="router.navigate(['/inquilinos'])">Cancelar</button>
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
export class InquilinoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(InquilinosService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly usuariosService = inject(UsuariosService);

  readonly editing = signal(false);
  readonly pending = signal(false);
  readonly usuarios = signal<Usuario[]>([]);

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    telefone: [''],
    email: ['', [Validators.required, Validators.email]],
    endereco: [''],
    observacoes: [''],
    usuarioId: [null as number | null]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editing.set(true);
      this.service.find(id).subscribe({
        next: inquilino => {
          this.form.patchValue({
            nome: inquilino.nome,
            cpf: inquilino.cpf,
            telefone: inquilino.telefone ?? '',
            email: inquilino.email,
            endereco: inquilino.endereco ?? '',
            observacoes: inquilino.observacoes ?? '',
            usuarioId: inquilino.usuario?.id ?? null
          });
        },
        error: () => this.notification.error('Nao foi possivel carregar o inquilino.')
      });
    }
    this.loadUsuarios();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    const payload = this.form.getRawValue();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const request = this.editing()
      ? this.service.update(id, payload)
      : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.pending.set(false);
        this.notification.success('Inquilino salvo com sucesso.');
        this.router.navigate(['/inquilinos']);
      },
      error: () => {
        this.pending.set(false);
        this.notification.error('Erro ao salvar o inquilino.');
      }
    });
  }

  private loadUsuarios(): void {
    this.usuariosService.list().subscribe({
      next: users => this.usuarios.set(users),
      error: () => this.notification.warning('Nao foi possivel carregar usuarios.')
    });
  }
}

























