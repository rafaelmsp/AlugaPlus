import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InquilinosService } from '../services/inquilinos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Inquilino } from '../../../core/models/inquilino.model';

@Component({
  standalone: true,
  selector: 'app-inquilino-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-primary">Inquilinos</h1>
          <p class="text-sm text-gray-400">Gerencie cadastros e vinculos de contratos.</p>
        </div>
        <a routerLink="novo" class="btn-primary text-sm w-full md:w-auto text-center">Novo Inquilino</a>
      </div>

      <div class="card overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs uppercase text-gray-400 border-b border-primary/20">
            <tr>
              <th class="py-3">Nome</th>
              <th class="py-3">CPF</th>
              <th class="py-3">Email</th>
              <th class="py-3">Telefone</th>
              <th class="py-3 text-right">Acoeses</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inquilino of inquilinos()" class="border-b border-primary/10">
              <td class="py-3">
                <div class="font-semibold text-white">{{ inquilino.nome }}</div>
                <div class="text-xs text-gray-400">Usuario: {{ inquilino.usuario?.email || 'Nao vinculado' }}</div>
              </td>
              <td class="py-3">{{ inquilino.cpf }}</td>
              <td class="py-3">{{ inquilino.email }}</td>
              <td class="py-3">{{ inquilino.telefone || '-' }}</td>
              <td class="py-3 text-right flex gap-2 justify-end">
                <a [routerLink]="['editar', inquilino.id]" class="btn-outline text-xs px-3 py-1">Editar</a>
                <button class="btn-outline text-xs px-3 py-1 border-rose-400 text-rose-400 hover:bg-rose-500/10"
                        (click)="remove(inquilino.id)">
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!inquilinos().length" class="text-center text-gray-500 py-6">
          Nenhum inquilino cadastrado.
        </p>
      </div>
    </div>
  `
})
export class InquilinoListComponent implements OnInit {
  private readonly service = inject(InquilinosService);
  private readonly notification = inject(NotificationService);

  readonly inquilinos = signal<Inquilino[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe({
      next: data => this.inquilinos.set(data),
      error: () => this.notification.error('Nao foi possivel carregar os inquilinos.')
    });
  }

  remove(id?: number): void {
    if (!id) {
      return;
    }
    this.service.remove(id).subscribe({
      next: () => {
        this.notification.success('Inquilino removido com sucesso.');
        this.load();
      },
      error: () => this.notification.error('Falha ao remover o inquilino.')
    });
  }
}

























