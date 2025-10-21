import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  standalone: true,
  selector: 'app-contrato-form',
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, NgxExtendedPdfViewerModule],
  template: `
    <div class="max-w-4xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">Cadastro de contrato</h1>
      <form [formGroup]="form" class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Imovel</label>
          <input formControlName="imovel" class="input-control" placeholder="Selecione o imovel">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Inquilino</label>
          <input formControlName="inquilino" class="input-control" placeholder="Selecione o inquilino">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Data de inicio</label>
          <input type="date" formControlName="dataInicio" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Data de fim</label>
          <input type="date" formControlName="dataFim" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Valor mensal</label>
          <input type="number" formControlName="valorMensal" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Status</label>
          <select formControlName="status" class="input-control">
            <option value="PENDENTE">Pendente</option>
            <option value="ATIVO">Ativo</option>
            <option value="ENCERRADO">Encerrado</option>
            <option value="RESCINDIDO">Rescindido</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">ObservAcoeses</label>
          <textarea formControlName="observacao" rows="3" class="input-control"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-3">Upload do contrato (PDF)</label>
          <ngx-dropzone (change)="onSelect($event)" [multiple]="false" class="bg-neutral border border-dashed border-primary/40">
            <ngx-dropzone-label>
              Arraste o PDF aqui ou clique para selecionar.
            </ngx-dropzone-label>
            <ngx-dropzone-preview *ngFor="let file of files()" [removable]="true" (removed)="onRemove(file)">
              <ngx-dropzone-label>{{ file.name }}</ngx-dropzone-label>
            </ngx-dropzone-preview>
          </ngx-dropzone>
        </div>
        <div *ngIf="previewUrl()" class="md:col-span-2 border border-primary/20 rounded-lg overflow-hidden">
          <ngx-extended-pdf-viewer [src]="previewUrl()" height="400px"></ngx-extended-pdf-viewer>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3 pt-4">
          <button class="btn-outline" type="button" (click)="router.navigate(['/contratos'])">Cancelar</button>
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
export class ContratoFormComponent {
  private readonly fb = new FormBuilder();
  readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    imovel: ['', Validators.required],
    inquilino: ['', Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: [''],
    valorMensal: [0, Validators.required],
    status: ['PENDENTE', Validators.required],
    observacao: ['']
  });

  readonly files = signal<File[]>([]);
  readonly previewUrl = signal<string | null>(null);

  onSelect(event: NgxDropzoneChangeEvent): void {
    const [file] = event.addedFiles;
    if (file) {
      this.files.set([file]);
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onRemove(file: File): void {
    this.files.set(this.files().filter(f => f !== file));
    this.previewUrl.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: Integrar com API de contratos utilizando ApiService.
    this.router.navigate(['/contratos']);
  }
}

























