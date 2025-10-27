import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanosService } from '../../../core/services/planos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AssinaturasService } from '../../../core/services/assinaturas.service';
import { Plano } from '../../../core/models/plano.model';
import { AssinaturaCheckoutResponse, FormaPagamento, PixCheckoutResponse } from '../../../core/models/assinatura.model';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Assinar plano</h1>
          <p class="text-sm text-gray-400">Escolha o plano ideal e finalize o pagamento.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div
          *ngFor="let plano of planos()"
          class="card border border-primary/30 cursor-pointer transition hover:border-primary"
          [class.outline]="form.get('planoId')?.value === plano.id"
          (click)="selecionarPlano(plano)">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-white">{{ plano.nome }}</h2>
            <span class="text-primary font-bold">{{ plano.valorMensal | currency:'BRL':'symbol':'1.2-2' }}</span>
          </div>
          <p class="text-sm text-gray-400 mt-2">{{ plano.descricao || 'Plano sem descricao detalhada.' }}</p>
          <ul class="mt-3 text-xs text-gray-300 space-y-1">
            <li>Usuarios: {{ plano.qtdeUsuarios ?? 'Ilimitado' }}</li>
            <li>Imoveis: {{ plano.qtdeImoveis ?? 'Ilimitado' }}</li>
            <li>Contratos: {{ plano.qtdeContratos ?? 'Ilimitado' }}</li>
            <li *ngIf="plano.recursosExtras">{{ plano.recursosExtras }}</li>
          </ul>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="checkout()" class="card space-y-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Forma de pagamento</label>
          <select formControlName="formaPagamento" class="input-control">
            <option value="PIX">Pix</option>
            <option value="CARTAO" disabled>Cartao (em breve)</option>
            <option value="BOLETO" disabled>Boleto (em breve)</option>
          </select>
        </div>
        <div class="flex justify-end gap-3">
          <button type="submit" class="btn-primary" [disabled]="form.invalid || pending">Finalizar assinatura</button>
        </div>
      </form>

      <div *ngIf="pixResposta()" class="card border border-primary/40">
        <h2 class="text-lg font-semibold text-primary mb-3">Pagamento via Pix</h2>
        <p class="text-sm text-gray-300 mb-2">Use a chave abaixo para concluir o pagamento.</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-400">Chave Pix</p>
            <p class="font-mono text-sm text-green-300 break-all">{{ pixResposta()?.chavePix }}</p>
            <p class="text-xs text-gray-400 mt-3">Valor</p>
            <p class="text-white font-semibold">{{ pixResposta()?.valor | currency:'BRL':'symbol':'1.2-2' }}</p>
          </div>
          <div class="flex flex-col gap-2 text-xs text-gray-300">
            <p>Copie o codigo abaixo e cole no app do banco:</p>
            <textarea
              readonly
              class="input-control h-40 font-mono text-xs">{{ pixResposta()?.qrCode }}</textarea>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
    .card {
      @apply bg-surface/60 backdrop-blur border border-primary/20 rounded-xl p-4;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly planosService = inject(PlanosService);
  private readonly assinaturasService = inject(AssinaturasService);
  private readonly notification = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    planoId: [null as number | null, Validators.required],
    formaPagamento: ['PIX' as FormaPagamento, Validators.required]
  });

  readonly planos = signal<Plano[]>([]);
  readonly pixResposta = signal<PixCheckoutResponse | null>(null);

  pending = false;

  ngOnInit(): void {
    this.planosService.listPublic().subscribe({
      next: planos => this.planos.set(planos.filter(p => p.ativo)),
      error: () => this.notification.error('Nao foi possivel carregar os planos disponiveis.')
    });
  }

  selecionarPlano(plano: Plano): void {
    if (!plano.id) {
      return;
    }
    this.form.patchValue({ planoId: plano.id });
  }

  checkout(): void {
    if (this.form.invalid) {
      this.notification.warning('Selecione um plano para continuar.');
      return;
    }
    this.pending = true;
    this.assinaturasService.criar(this.form.getRawValue()).subscribe({
      next: resposta => this.handleCheckout(resposta),
      error: () => {
        this.pending = false;
        this.notification.error('Nao foi possivel iniciar a assinatura.');
      }
    });
  }

  private handleCheckout(resposta: AssinaturaCheckoutResponse): void {
    this.pending = false;
    if (resposta.pix) {
      this.pixResposta.set(resposta.pix);
      this.notification.success('Assinatura criada! Conclua o pagamento via Pix.');
    } else {
      this.notification.success('Assinatura registrada com sucesso.');
    }
  }
}
