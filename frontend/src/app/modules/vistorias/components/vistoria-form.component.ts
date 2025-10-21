import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

interface FotoPreview {
  src: string;
  caption?: string;
  thumb?: string;
}

@Component({
  standalone: true,
  selector: 'app-vistoria-form',
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, LightboxModule],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">Registro de vistoria</h1>
      <form [formGroup]="form" class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Imovel</label>
          <input formControlName="imovelId" class="input-control" placeholder="ID do imovel">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Contrato</label>
          <input formControlName="contratoId" class="input-control" placeholder="ID do contrato (opcional)">
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
export class VistoriaFormComponent {
  private readonly fb = new FormBuilder();
  readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    imovelId: ['', Validators.required],
    contratoId: [''],
    dataVistoria: ['', Validators.required],
    tipo: ['ENTRADA', Validators.required],
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: Integrar com API de vistorias.
    this.router.navigate(['/vistorias']);
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
























