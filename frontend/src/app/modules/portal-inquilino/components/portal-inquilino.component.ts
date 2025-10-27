import { Component, ElementRef, ViewChild, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PagamentoListComponent, PagamentoResumo } from '../../contratos/components/pagamento-list.component';
import { PortalContrato, PortalInquilinoService } from '../services/portal-inquilino.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-portal-inquilino',
  imports: [CommonModule, PagamentoListComponent],
  template: `
    <div class="space-y-6">
      <input #comprovanteInput type="file" class="hidden" accept="image/*,application/pdf"
             (change)="onComprovanteSelecionado($event)">

      <header class="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Portal do inquilino</h1>
          <p class="text-sm text-gray-400">
            Bem-vindo, {{ usuario()?.nome }}! Acompanhe seus contratos, boletos e vistorias.
          </p>
        </div>
        <button class="btn-outline" type="button" (click)="logout()">Sair</button>
      </header>

      <section *ngIf="loading()" class="card text-center text-gray-400">
        Carregando contratos...
      </section>

      <section *ngIf="!loading() && !contratos().length" class="card text-center text-gray-400">
        Nenhum contrato vinculado ao seu usuário.
      </section>

      <section class="grid gap-4 md:grid-cols-2" *ngIf="contratos().length">
        <article class="card" *ngFor="let contrato of contratos()">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-primary">Contrato #{{ contrato.id }}</h2>
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {{ contrato.status }}
            </span>
          </div>
          <p class="text-sm text-gray-300 mt-1">{{ contrato.imovelDescricao }}</p>
          <p class="text-sm text-gray-300 mt-1">
            Valor mensal: {{ contrato.valorMensal | currency:'BRL':'symbol':'1.0-2' }}
          </p>
          <p class="text-sm text-gray-400 mt-1">
            Próxima vistoria: {{ contrato.proximaVistoria ? (contrato.proximaVistoria | date:'longDate') : 'Sem agendamento' }}
          </p>
          <app-pagamento-list
            [contratoId]="contrato.id"
            [data]="contrato.pagamentos"
            [allowActions]="false"
            [uploadHandler]="uploadHandler">
          </app-pagamento-list>
        </article>
      </section>
    </div>
  `
})
export class PortalInquilinoComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly portalService = inject(PortalInquilinoService);
  private readonly notification = inject(NotificationService);

  @ViewChild('comprovanteInput', { static: true }) comprovanteInput?: ElementRef<HTMLInputElement>;

  readonly usuario = signal(this.authService.getCurrentUser());
  readonly contratos = signal<PortalContrato[]>([]);
  readonly loading = signal<boolean>(true);

  private pagamentoSelecionado: PagamentoResumo | null = null;
  readonly uploadHandler = (pagamento: PagamentoResumo) => this.solicitarUpload(pagamento);

  ngOnInit(): void {
    this.carregarContratos();
  }

  private carregarContratos(): void {
    this.loading.set(true);
    this.portalService.listarContratos().subscribe({
      next: contratos => {
        this.contratos.set(contratos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Não foi possível carregar seus contratos');
      }
    });
  }

  private solicitarUpload(pagamento: PagamentoResumo): void {
    this.pagamentoSelecionado = pagamento;
    const input = this.comprovanteInput?.nativeElement;
    if (!input) {
      this.notification.error('Campo de upload não está disponível');
      return;
    }
    input.value = '';
    input.click();
  }

  onComprovanteSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.pagamentoSelecionado) {
      return;
    }
    const arquivo = input.files[0];
    this.portalService.enviarComprovante(this.pagamentoSelecionado.id, arquivo).subscribe({
      next: () => {
        this.notification.success('Comprovante enviado com sucesso');
        this.pagamentoSelecionado = null;
      },
      error: () => {
        this.notification.error('Não foi possível enviar o comprovante');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
