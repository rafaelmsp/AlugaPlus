import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PagamentoListComponent } from '../../contratos/components/pagamento-list.component';

interface PortalContrato {
  id: number;
  imovel: string;
  status: string;
  valorMensal: number;
  proximaVistoria?: string;
  pagamentos: {
    id: number;
    vencimento: string;
    valor: number;
    status: string;
    dataPagamento?: string;
  }[];
}

@Component({
  standalone: true,
  selector: 'app-portal-inquilino',
  imports: [CommonModule, PagamentoListComponent],
  template: `
    <div class="space-y-6">
      <header class="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Portal do inquilino</h1>
          <p class="text-sm text-gray-400">
            Bem-vindo, {{ usuario()?.nome }}! Acompanhe seus contratos, boletos e vistorias.
          </p>
        </div>
        <button class="btn-outline" type="button" (click)="logout()">Sair</button>
      </header>

      <section class="grid gap-4 md:grid-cols-2">
        <article class="card" *ngFor="let contrato of contratos()">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-primary">Contrato #{{ contrato.id }}</h2>
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {{ contrato.status }}
            </span>
          </div>
          <p class="text-sm text-gray-300 mt-1">{{ contrato.imovel }}</p>
          <p class="text-sm text-gray-300 mt-1">
            Valor mensal: {{ contrato.valorMensal | currency:'BRL':'symbol':'1.0-2' }}
          </p>
          <p class="text-sm text-gray-400 mt-1">
            Proxima vistoria: {{ contrato.proximaVistoria ? (contrato.proximaVistoria | date:'longDate') : 'Sem agendamento' }}
          </p>
          <button class="btn-primary mt-4 text-sm" type="button" (click)="uploadComprovante(contrato.id)">
            Enviar comprovante
          </button>
          <app-pagamento-list
            [contratoId]="contrato.id"
            [data]="contrato.pagamentos">
          </app-pagamento-list>
        </article>
      </section>
    </div>
  `
})
export class PortalInquilinoComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly usuario = signal(this.authService.getCurrentUser());
  readonly contratos = signal<PortalContrato[]>([]);

  ngOnInit(): void {
    this.contratos.set([
      {
        id: 1,
        imovel: 'Rua das Palmeiras, 15 - Apto 302',
        status: 'ATIVO',
        valorMensal: 2800,
        proximaVistoria: new Date().toISOString(),
        pagamentos: [
          { id: 1, vencimento: new Date().toISOString(), valor: 2800, status: 'PENDENTE' },
          { id: 2, vencimento: new Date().toISOString(), valor: 2800, status: 'PAGO', dataPagamento: new Date().toISOString() }
        ]
      }
    ]);
  }

  uploadComprovante(contratoId: number): void {
    alert(`Upload de comprovante para o contrato #${contratoId} (placeholder).`);
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
























