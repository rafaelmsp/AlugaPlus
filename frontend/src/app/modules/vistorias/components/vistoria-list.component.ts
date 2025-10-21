import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface VistoriaResumo {
  id: number;
  imovel: string;
  contrato?: string;
  dataVistoria: string;
  tipo: string;
  avaliacao?: number;
}

@Component({
  standalone: true,
  selector: 'app-vistoria-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Vistorias</h1>
          <p class="text-sm text-gray-400">Controle de vistorias com fotos e relatorios.</p>
        </div>
        <a routerLink="nova" class="btn-primary text-sm w-full md:w-auto text-center">Agendar vistoria</a>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Imovel</th>
              <th class="py-2">Contrato</th>
              <th class="py-2">Data</th>
              <th class="py-2">Tipo</th>
              <th class="py-2">Avaliacao</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let vistoria of vistorias()" class="border-b border-primary/10">
              <td class="py-2">{{ vistoria.imovel }}</td>
              <td class="py-2">{{ vistoria.contrato || 'N/A' }}</td>
              <td class="py-2">{{ vistoria.dataVistoria | date:'shortDate' }}</td>
              <td class="py-2">
                <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {{ vistoria.tipo }}
                </span>
              </td>
              <td class="py-2">
                <span *ngIf="vistoria.avaliacao; else semNota">
                  {{ vistoria.avaliacao }}/10
                </span>
                <ng-template #semNota>--</ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class VistoriaListComponent {
  readonly vistorias = signal<VistoriaResumo[]>([
    {
      id: 1,
      imovel: 'Rua Azul, 45 - Casa',
      contrato: 'Contrato #10',
      dataVistoria: new Date().toISOString(),
      tipo: 'ENTRADA',
      avaliacao: 9
    }
  ]);
}
























