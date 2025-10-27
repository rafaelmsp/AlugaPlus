import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssinaturasService } from '../../../core/services/assinaturas.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Assinatura } from '../../../core/models/assinatura.model';

@Component({
  standalone: true,
  selector: 'app-assinatura-detalhe',
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto card" *ngIf="assinatura(); else loadingTpl">
      <h1 class="text-2xl font-semibold text-primary mb-6">Detalhes da Assinatura</h1>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <dt class="text-gray-400">Usuario</dt>
          <dd class="text-white">#{{ assinatura()?.usuarioId }}</dd>
        </div>
        <div>
          <dt class="text-gray-400">Plano</dt>
          <dd class="text-white">{{ assinatura()?.planoNome || ('Plano #' + assinatura()?.planoId) }}</dd>
        </div>
        <div>
          <dt class="text-gray-400">Status</dt>
          <dd>
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{{ assinatura()?.status }}</span>
          </dd>
        </div>
        <div>
          <dt class="text-gray-400">Forma de pagamento</dt>
          <dd class="text-white">{{ assinatura()?.formaPagamento }}</dd>
        </div>
        <div>
          <dt class="text-gray-400">Data de inicio</dt>
          <dd class="text-white">{{ assinatura()?.dataInicio | date:'short' }}</dd>
        </div>
        <div>
          <dt class="text-gray-400">Data de termino</dt>
          <dd class="text-white">{{ assinatura()?.dataFim ? (assinatura()?.dataFim | date:'short') : '-' }}</dd>
        </div>
        <div *ngIf="assinatura()?.chavePix">
          <dt class="text-gray-400">Chave Pix</dt>
          <dd class="font-mono text-xs text-green-300 break-all">{{ assinatura()?.chavePix }}</dd>
        </div>
        <div *ngIf="assinatura()?.transacaoId">
          <dt class="text-gray-400">Transacao</dt>
          <dd class="font-mono text-xs text-gray-300 break-all">{{ assinatura()?.transacaoId }}</dd>
        </div>
      </dl>
      <div class="mt-6 flex justify-end">
        <button class="btn-outline" type="button" (click)="voltar()">Voltar</button>
      </div>
    </div>
    <ng-template #loadingTpl>
      <div class="max-w-3xl mx-auto card text-center text-gray-400">Carregando detalhes...</div>
    </ng-template>
  `
})
export class AssinaturaDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assinaturasService = inject(AssinaturasService);
  private readonly notification = inject(NotificationService);

  readonly assinatura = signal<Assinatura | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/admin/assinaturas']);
      return;
    }
    this.assinaturasService.buscar(id).subscribe({
      next: dados => this.assinatura.set(dados),
      error: () => {
        this.notification.error('Assinatura nao encontrada.');
        this.router.navigate(['/admin/assinaturas']);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/assinaturas']);
  }
}
