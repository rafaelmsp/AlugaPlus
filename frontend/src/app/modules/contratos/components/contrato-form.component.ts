import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { finalize } from 'rxjs';
import { ImoveisService } from '../../imoveis/services/imoveis.service';
import { InquilinosService } from '../../inquilinos/services/inquilinos.service';
import { Imovel } from '../../../core/models/imovel.model';
import { Inquilino } from '../../../core/models/inquilino.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ContratosService, CreateContratoPayload } from '../services/contratos.service';

@Component({
  standalone: true,
  selector: 'app-contrato-form',
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, NgxExtendedPdfViewerModule],
  template: `
    <div class="max-w-4xl mx-auto card">
      <h1 class="text-2xl font-semibold text-primary mb-6">Cadastro de contrato</h1>
      <form [formGroup]="form" (ngSubmit)="save()" class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Imovel</label>
          <select formControlName="imovelId" class="input-control">
            <option [ngValue]="null">Selecione o imovel</option>
            <option *ngFor="let imovel of imoveis()" [ngValue]="imovel.id">
              {{ imovel.endereco }} - {{ imovel.tipo }}
            </option>
          </select>
          <p *ngIf="!imoveis().length" class="text-xs text-gray-500 mt-1">
            Nenhum imovel cadastrado. Cadastre em Imoveis.
          </p>
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Inquilino</label>
          <select formControlName="inquilinoId" class="input-control">
            <option [ngValue]="null">Selecione o inquilino</option>
            <option *ngFor="let inquilino of inquilinos()" [ngValue]="inquilino.id">
              {{ inquilino.nome }} - {{ inquilino.email }}
            </option>
          </select>
          <p *ngIf="!inquilinos().length" class="text-xs text-gray-500 mt-1">
            Nenhum inquilino cadastrado. Cadastre em Inquilinos.
          </p>
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
          <ngx-extended-pdf-viewer 
            [src]="previewUrl()" 
            [textLayer]="true"
            [useBrowserLocale]="true"
            height="400px"
            [handTool]="true"
            [showHandToolButton]="true"
            [zoom]="'page-width'"
            [logLevel]="0"
          ></ngx-extended-pdf-viewer>
        </div>
        <div class="md:col-span-2 flex justify-end gap-3 pt-4">
          <button class="btn-outline" type="button" (click)="router.navigate(['/contratos'])">Cancelar</button>
          <button class="btn-primary" type="submit" [disabled]="form.invalid || pending()">Salvar</button>
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
export class ContratoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  private readonly imoveisService = inject(ImoveisService);
  private readonly inquilinosService = inject(InquilinosService);
  private readonly notification = inject(NotificationService);
  private readonly contratosService = inject(ContratosService);

  readonly imoveis = signal<Imovel[]>([]);
  readonly inquilinos = signal<Inquilino[]>([]);
  readonly pending = signal(false);

  readonly form = this.fb.group({
    imovelId: [null as number | null, Validators.required],
    inquilinoId: [null as number | null, Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: [''],
    valorMensal: [0, [Validators.required, Validators.min(0)]],
    status: ['PENDENTE', Validators.required],
    observacao: ['']
  });

  ngOnInit(): void {
    this.loadImoveis();
    this.loadInquilinos();
  }

  private loadImoveis(): void {
    this.imoveisService.list().subscribe({
      next: data => this.imoveis.set(data),
      error: () => this.notification.warning('Nao foi possivel carregar os imoveis.')
    });
  }

  private loadInquilinos(): void {
    this.inquilinosService.list().subscribe({
      next: data => this.inquilinos.set(data),
      error: () => this.notification.warning('Nao foi possivel carregar os inquilinos.')
    });
  }

  readonly files = signal<File[]>([]);
  readonly previewUrl = signal<string | null>(null);

  onSelect(event: NgxDropzoneChangeEvent): void {
    const [file] = event.addedFiles;
    if (file && file.type === 'application/pdf') {
      this.files.set([file]);
      this.previewUrl.set(URL.createObjectURL(file));
    } else {
      this.notification.warning('Por favor, selecione apenas arquivos PDF.');
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
    this.pending.set(true);
    const value = this.form.getRawValue();

    const payload: CreateContratoPayload = {
      imovelId: value.imovelId as number,
      inquilinoId: value.inquilinoId as number,
      dataInicio: value.dataInicio ?? '',
      dataFim: value.dataFim ? value.dataFim : null,
      valorMensal: Number(value.valorMensal ?? 0),
      status: value.status ?? 'PENDENTE',
      observacao: value.observacao?.trim() ? value.observacao : null
    };

    const arquivo = this.files().length ? this.files()[0] : undefined;

    this.contratosService.create(payload, arquivo).pipe(
      finalize(() => this.pending.set(false))
    ).subscribe({
      next: () => {
        this.notification.success('Contrato salvo com sucesso.');
        this.files.set([]);
        this.previewUrl.set(null);
        this.router.navigate(['/contratos']);
      },
      error: (error) => {
        console.error('Erro ao salvar contrato', error);
        const message = error?.error?.message ?? 'Falha ao salvar o contrato.';
        this.notification.error(message);
      }
    });
  }
}

























