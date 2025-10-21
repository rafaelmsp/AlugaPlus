import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div class="card w-full max-w-md">
        <h1 class="text-2xl font-semibold mb-6 text-primary text-center">Entrar</h1>
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Email</label>
            <input formControlName="email" type="email" autocomplete="username" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="admin@alugaplus.com">
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">Senha</label>
            <input formControlName="senha" type="password" autocomplete="current-password" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="------">
          </div>
          <button class="btn-primary w-full" type="submit" [disabled]="form.invalid || pending">
            {{ pending ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <div class="flex justify-between text-xs text-gray-400 mt-4">
          <a routerLink="../register" class="hover:text-primary transition">Cadastrar</a>
          <a routerLink="../recover" class="hover:text-primary transition">Esqueci minha senha</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  pending = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.pending = true;
    this.authService.login(this.form.getRawValue()).subscribe({
      next: response => {
        this.pending = false;
        this.notification.success('Bem-vindo de volta!');
        const target = response.role === 'INQUILINO' ? '/portal' : '/dashboard';
        this.router.navigate([target]);
      },
      error: () => {
        this.pending = false;
        this.notification.error('Falha no login. Verifique suas credenciais.');
      }
    });
  }
}

























