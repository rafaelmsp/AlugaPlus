import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { VistoriaService } from '../services/vistoria.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImoveisService } from '../../imoveis/services/imoveis.service';
import { Imovel } from '../../../core/models/imovel.model';

interface FotoPreview {
  src: string;
  caption?: string;
  thumb?: string;
}

@Component({
  standalone: true,
  selector: 'app-vistoria-form',
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, LightboxModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">Registro de vistoria</h1>
      <form [formGroup]="form" class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Imóvel</label>
          <select formControlName="imovelId" class="input-control">
            <option [ngValue]="null">Selecione o imóvel</option>
            <option *ngFor="let imovel of imoveis()" [ngValue]="imovel.id">
              {{ imovel.endereco }} - {{ imovel.tipo }}
            </option>
          </select>
          <div *ngIf="form.get('imovelId')?.touched && form.get('imovelId')?.errors?.['required']" class="text-xs text-red-500 mt-1">
            Selecione um imóvel
          </div>
          <div *ngIf="!imoveis().length" class="text-xs text-gray-500 mt-1">
            Nenhum imóvel cadastrado. <a routerLink="/imoveis/novo" class="text-primary hover:underline">Cadastre um imóvel</a>
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Contrato</label>
          <input type="number" min="1" formControlName="contratoId" class="input-control" placeholder="ID do contrato (opcional)">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Data da vistoria</label>
          <input type="date" formControlName="dataVistoria" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Tipo</label>
          <select formControlName="tipo" class="input-control">
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saida</option>
            <option value="ROTINA">Rotina</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Observacoes</label>
          <textarea formControlName="observacoes" rows="4" class="input-control"></textarea>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Avaliacao (0-10)</label>
          <input type="number" min="0" max="10" formControlName="avaliacao" class="input-control">
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-3">Fotos da vistoria</label>
          <ngx-dropzone (change)="onSelect($event)" [multiple]="true" class="bg-neutral border border-dashed border-primary/40">
            <ngx-dropzone-label>
              Arraste as fotos aqui ou clique para selecionar.
            </ngx-dropzone-label>
            <ngx-dropzone-preview *ngFor="let file of files()" [removable]="true" (removed)="onRemove(file)">
              <ngx-dropzone-label>{{ file.name }}</ngx-dropzone-label>
            </ngx-dropzone-preview>
          </ngx-dropzone>
        </div>
        <div class="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            *ngFor="let foto of previews(); let i = index"
            class="relative block group"
            (click)="openLightbox(i)">
            <img [src]="foto.thumb" alt="foto vistoria" class="rounded-lg border border-primary/20">
            <span class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs">Ver</span>
          </a>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button class="btn-outline" type="button" (click)="router.navigate(['/vistorias'])">Cancelar</button>
          <button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">Salvar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
    ngx-dropzone {
      @apply rounded-lg p-6 text-center text-sm text-gray-400;
    }
  `]
})
export class VistoriaFormComponent implements OnInit {
  private readonly fb = new FormBuilder();
  readonly router = inject(Router);
  private readonly imoveisService = inject(ImoveisService);
  
  readonly imoveis = signal<Imovel[]>([]);
  
  ngOnInit(): void {
    this.loadImoveis();
  }
  
  private loadImoveis(): void {
    this.imoveisService.list().subscribe({
      next: (imoveis) => this.imoveis.set(imoveis),
      error: (error) => {
        console.error('Erro ao carregar imóveis', error);
        this.notification.error('Erro ao carregar a lista de imóveis');
      }
    });
  }

  readonly form = this.fb.nonNullable.group({
    imovelId: [null as number | null, Validators.required],
    contratoId: [null as number | null],
    dataVistoria: ['', Validators.required],
    tipo: ['ENTRADA' as 'ENTRADA' | 'SAIDA' | 'ROTINA', Validators.required],
    observacoes: [''],
    avaliacao: [null as number | null]
  });

  readonly files = signal<File[]>([]);
  readonly previews = signal<FotoPreview[]>([]);

  onSelect(event: NgxDropzoneChangeEvent): void {
    const next = [...this.files(), ...event.addedFiles];
    this.files.set(next);
    next.forEach(file => this.createPreview(file));
  }

  onRemove(file: File): void {
    this.files.set(this.files().filter(f => f !== file));
    this.previews.set(this.previews().filter(pre => pre.caption !== file.name));
  }

  openLightbox(index: number): void {
    // LightboxModule requires injection, but to keep standalone we simply open in new tab
    const foto = this.previews()[index];
    if (foto?.src) {
      window.open(foto.src, '_blank');
    }
  }

  private readonly vistoriaService = inject(VistoriaService);
  private readonly notification = inject(NotificationService);
  private readonly pending = signal(false);

  save(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.pending.set(true);
    const value = this.form.getRawValue();
    
    this.vistoriaService.criar({
      imovelId: Number(value.imovelId),
      contratoId: value.contratoId ? Number(value.contratoId) : undefined,
      dataVistoria: value.dataVistoria,
      tipo: value.tipo,
      observacoes: value.observacoes,
      avaliacao: value.avaliacao || undefined
    }).subscribe({
      next: (vistoria) => {
        if (this.files().length > 0) {
          this.vistoriaService.uploadFotos(vistoria.id!, this.files()).subscribe({
            next: () => {
              this.notification.success('Vistoria registrada com sucesso');
              this.router.navigate(['/vistorias']);
            },
            error: (error) => {
              console.error('Erro ao fazer upload das fotos', error);
              const message = error?.error?.message ?? 'Erro ao fazer upload das fotos';
              this.notification.error(message);
              this.pending.set(false);
            }
          });
        } else {
          this.notification.success('Vistoria registrada com sucesso');
          this.router.navigate(['/vistorias']);
        }
      },
      error: (error) => {
        console.error('Erro ao salvar vistoria', error);
        const message = error?.error?.message ?? 'Erro ao salvar vistoria';
        this.notification.error(message);
        this.pending.set(false);
      }
    });
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const preview: FotoPreview = { src, thumb: src, caption: file.name };
      this.previews.set([...this.previews(), preview]);
    };
    reader.readAsDataURL(file);
  }
}
























