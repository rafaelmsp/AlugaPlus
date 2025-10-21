import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-recover',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div class="card w-full max-w-md">
        <h1 class="text-2xl font-semibold mb-4 text-primary text-center">Recuperar senha</h1>
        <p class="text-sm text-gray-400 mb-6 text-center">
          Informe seu email cadastrado. Enviaremos instrucoes para a redefinicao.
        </p>
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
          </div>
          <button class="btn-primary w-full" type="submit" [disabled]="form.invalid">
            Enviar instrucoes
          </button>
        </form>
        <div class="text-xs text-gray-400 mt-4 text-center">
          <a routerLink="../login" class="text-primary hover:underline">Voltar ao login</a>
        </div>
      </div>
    </div>
  `
})
export class RecoverComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.notification.info('Se o email estiver cadastrado, uma mensagem sera enviada.');
    this.form.reset();
  }
}

























