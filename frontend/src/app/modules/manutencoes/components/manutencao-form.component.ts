import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  standalone: true,
  selector: 'app-manutencao-form',
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule],
  template: `
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">Cadastrar manutencao</h1>
      <form [formGroup]="form" class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Imovel</label>
          <input formControlName="imovelId" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Contrato</label>
          <input formControlName="contratoId" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Data solicitacao</label>
          <input type="date" formControlName="dataSolicitacao" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Responsavel</label>
          <input formControlName="responsavel" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Custo estimado</label>
          <input type="number" formControlName="custo" class="input-control">
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Status</label>
          <select formControlName="status" class="input-control">
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluida</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-1">Descricao</label>
          <textarea formControlName="descricao" rows="4" class="input-control"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="text-sm text-gray-400 block mb-3">Fotos</label>
          <ngx-dropzone (change)="onSelect($event)" [multiple]="true" class="bg-neutral border border-dashed border-primary/40">
            <ngx-dropzone-label>
              Arraste as imagens aqui ou clique para enviar.
            </ngx-dropzone-label>
            <ngx-dropzone-preview *ngFor="let file of files()" [removable]="true" (removed)="onRemove(file)">
              <ngx-dropzone-label>{{ file.name }}</ngx-dropzone-label>
            </ngx-dropzone-preview>
          </ngx-dropzone>
        </div>
        <div class="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <img *ngFor="let preview of previews()" [src]="preview" alt="foto manutencao" class="rounded-lg border border-primary/20">
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button class="btn-outline" type="button" (click)="router.navigate(['/manutencoes'])">Cancelar</button>
          <button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">Salvar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .input-control {
      @apply w-full bg-neutral border border-primary/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none;
    }
  `]
})
export class ManutencaoFormComponent {
  private readonly fb = new FormBuilder();
  readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    imovelId: ['', Validators.required],
    contratoId: [''],
    dataSolicitacao: ['', Validators.required],
    descricao: ['', Validators.required],
    responsavel: [''],
    custo: [0],
    status: ['PENDENTE', Validators.required]
  });

  readonly files = signal<File[]>([]);
  readonly previews = signal<string[]>([]);

  onSelect(event: NgxDropzoneChangeEvent): void {
    const next = [...this.files(), ...event.addedFiles];
    this.files.set(next);
    next.forEach(file => this.createPreview(file));
  }

  onRemove(file: File): void {
    this.files.set(this.files().filter(f => f !== file));
    this.previews.set(this.previews().filter(src => !src.includes(file.name)));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: Integrar com API de manutencoes.
    this.router.navigate(['/manutencoes']);
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.previews.set([...this.previews(), reader.result as string]);
    reader.readAsDataURL(file);
  }
}
























