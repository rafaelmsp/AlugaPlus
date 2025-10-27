import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VistoriaService } from '../services/vistoria.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NgOptimizedImage } from '@angular/common';

interface VistoriaResumo {
  id: number;
  imovel: string;
  contrato?: string;
  dataVistoria: string;
  tipo: string;
  avaliacao?: number;
  fotos?: string[];
}

interface FotosModal {
  visible: boolean;
  fotos: string[];
  currentIndex: number;
}

@Component({
  standalone: true,
  selector: 'app-vistoria-list',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Vistorias</h1>
          <p class="text-sm text-gray-400">Controle de vistorias com fotos e relatorios.</p>
        </div>
        <a routerLink="nova" class="btn-primary text-sm w-full md:w-auto text-center">Agendar vistoria</a>
      </div>

      <div class="card overflow-x-auto relative">
        <div *ngIf="loading()" class="absolute inset-0 bg-black/5 flex items-center justify-center">
          <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-2">Imovel</th>
              <th class="py-2">Contrato</th>
              <th class="py-2">Data</th>
              <th class="py-2">Tipo</th>
              <th class="py-2">Avaliacao</th>
              <th class="py-2">Fotos</th>
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
              <td class="py-2">
                <div *ngIf="vistoria.fotos?.length" class="flex gap-2">
                  <img 
                    *ngFor="let foto of vistoria.fotos.slice(0, 3)" 
                    [src]="foto" 
                    [alt]="'Foto da vistoria ' + vistoria.id"
                    class="w-12 h-12 rounded object-cover border border-primary/20 cursor-pointer hover:opacity-80 transition-opacity"
                    (click)="openFotos(vistoria.fotos)"
                  >
                  <div *ngIf="vistoria.fotos.length > 3" 
                       class="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-xs text-primary cursor-pointer hover:opacity-80 transition-opacity"
                       (click)="openFotos(vistoria.fotos)">
                    +{{ vistoria.fotos.length - 3 }}
                  </div>
                </div>
                <span *ngIf="!vistoria.fotos?.length" class="text-xs text-gray-400">
                  Sem fotos
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Fotos -->
    <div *ngIf="fotosModal().visible" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full relative">
        <!-- Cabeçalho do Modal -->
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium">Fotos da Vistoria</h3>
          <button (click)="closeFotosModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Conteúdo do Modal -->
        <div class="p-4">
          <div class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img [src]="fotosModal().fotos[fotosModal().currentIndex]" 
                 class="w-full h-full object-contain"
                 [alt]="'Foto ' + (fotosModal().currentIndex + 1)">
            
            <!-- Botões de navegação -->
            <button *ngIf="fotosModal().currentIndex > 0"
                    (click)="previousFoto()"
                    class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button *ngIf="fotosModal().currentIndex < fotosModal().fotos.length - 1"
                    (click)="nextFoto()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
            <div *ngFor="let foto of fotosModal().fotos; let i = index"
                 class="w-16 h-16 flex-shrink-0 cursor-pointer"
                 [class.border-2]="i === fotosModal().currentIndex"
                 [class.border-primary]="i === fotosModal().currentIndex"
                 (click)="goToFoto(i)">
              <img [src]="foto" 
                   [alt]="'Miniatura ' + (i + 1)"
                   class="w-full h-full object-cover rounded">
            </div>
          </div>
        </div>

        <!-- Informações -->
        <div class="p-4 border-t border-gray-200 text-sm text-gray-500">
          Foto {{ fotosModal().currentIndex + 1 }} de {{ fotosModal().fotos.length }}
        </div>
      </div>
    </div>
  `
})
export class VistoriaListComponent implements OnInit {
  private readonly vistoriaService = inject(VistoriaService);
  private readonly notification = inject(NotificationService);
  
  readonly vistorias = signal<VistoriaResumo[]>([]);
  readonly loading = signal(true);
  readonly fotosModal = signal<FotosModal>({
    visible: false,
    fotos: [],
    currentIndex: 0
  });

  ngOnInit(): void {
    this.loadVistorias();
  }

  private loadVistorias(): void {
    this.loading.set(true);
    this.vistoriaService.list().subscribe({
      next: (vistorias) => {
        this.vistorias.set(vistorias.map(v => ({
          id: v.id!,
          imovel: v.imovelEndereco || 'Imóvel não encontrado',
          contrato: v.contratoId ? `Contrato #${v.contratoId}` : undefined,
          dataVistoria: v.dataVistoria,
          tipo: v.tipo,
          avaliacao: v.avaliacao,
          fotos: v.fotos
        })));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar vistorias', error);
        this.notification.error('Erro ao carregar a lista de vistorias');
        this.loading.set(false);
      }
    });
  }

  openFotos(fotos: string[]): void {
    this.fotosModal.set({
      visible: true,
      fotos,
      currentIndex: 0
    });
  }

  closeFotosModal(): void {
    this.fotosModal.set({
      visible: false,
      fotos: [],
      currentIndex: 0
    });
  }

  previousFoto(): void {
    const currentModal = this.fotosModal();
    if (currentModal.currentIndex > 0) {
      this.fotosModal.set({
        ...currentModal,
        currentIndex: currentModal.currentIndex - 1
      });
    }
  }

  nextFoto(): void {
    const currentModal = this.fotosModal();
    if (currentModal.currentIndex < currentModal.fotos.length - 1) {
      this.fotosModal.set({
        ...currentModal,
        currentIndex: currentModal.currentIndex + 1
      });
    }
  }

  goToFoto(index: number): void {
    const currentModal = this.fotosModal();
    this.fotosModal.set({
      ...currentModal,
      currentIndex: index
    });
  }
}
























