import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImoveisService } from '../services/imoveis.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Imovel } from '../../../core/models/imovel.model';

@Component({
  standalone: true,
  selector: 'app-imovel-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Imoveis</h1>
          <p class="text-sm text-gray-400">Gerencie imoveis e disponibilidade.</p>
        </div>
        <a routerLink="novo" class="btn-primary text-sm w-full md:w-auto text-center">Novo Imovel</a>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-3">Endereco</th>
              <th class="py-3">Tipo</th>
              <th class="py-3">Valor</th>
              <th class="py-3">Status</th>
              <th class="py-3 text-right">Acoeses</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let imovel of imoveis()" class="border-b border-primary/10">
              <td class="py-3">{{ imovel.endereco }}</td>
              <td class="py-3">{{ imovel.tipo }}</td>
              <td class="py-3">{{ imovel.valorAluguel | currency:'BRL':'symbol':'1.0-2' }}</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {{ imovel.status }}
                </span>
              </td>
              <td class="py-3 text-right flex gap-2 justify-end">
                <a [routerLink]="['editar', imovel.id]" class="btn-outline text-xs px-3 py-1">Editar</a>
                <button class="btn-outline text-xs px-3 py-1 border-rose-400 text-rose-400 hover:bg-rose-500/10"
                        (click)="remove(imovel.id)">
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!loading() && !imoveis().length" class="text-center text-gray-500 py-6">
          Nenhum imovel cadastrado.
        </p>
      </div>
    </div>
  `
})
export class ImovelListComponent implements OnInit {
  private readonly service = inject(ImoveisService);
  private readonly notification = inject(NotificationService);

  readonly imoveis = signal<Imovel[]>([]);
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: data => {
        this.imoveis.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Nao foi possivel carregar os imoveis.');
      }
    });
  }

  remove(id?: number): void {
    if (!id) {
      return;
    }
    this.service.remove(id).subscribe({
      next: () => {
        this.notification.success('Imovel removido com sucesso.');
        this.load();
      },
      error: () => this.notification.error('Falha ao remover o imovel.')
    });
  }
}

























