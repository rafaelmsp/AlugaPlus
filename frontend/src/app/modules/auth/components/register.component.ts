import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div class="card w-full max-w-lg">
        <h1 class="text-2xl font-semibold mb-6 text-primary text-center">Cadastrar usuario</h1>
        <form [formGroup]="form" (ngSubmit)="submit()" class="grid md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-300 mb-1">Nome</label>
            <input formControlName="nome" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-300 mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Senha</label>
            <input formControlName="senha" type="password" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Perfil</label>
            <select formControlName="role" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
              <option value="ADMIN">Administrador</option>
              <option value="GESTOR">Gestor</option>
              <option value="INQUILINO">Inquilino</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <button class="btn-primary w-full" type="submit" [disabled]="form.invalid || pending">
              {{ pending ? 'Enviando...' : 'Cadastrar' }}
            </button>
          </div>
        </form>
        <div class="text-center text-xs text-gray-400 mt-4">
          Ja possui conta?
          <a routerLink="../login" class="text-primary hover:underline font-semibold">Entrar</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  pending = false;

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    role: this.fb.nonNullable.control<'ADMIN' | 'GESTOR' | 'INQUILINO'>('GESTOR')
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending = true;
    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.pending = false;
        this.notification.success('Usuario cadastrado com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.pending = false;
        this.notification.error('Nao foi possivel cadastrar o usuario.');
      }
    });
  }
}

























