import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Contrato } from '../../../core/models/contrato.model';

export interface CreateContratoPayload {
  imovelId: number;
  inquilinoId: number;
  dataInicio: string;
  dataFim?: string | null;
  valorMensal: number;
  status: string;
  observacao?: string | null;
}

interface PageResponse<T> {
  content: T[];
}

@Injectable({ providedIn: 'root' })
export class ContratosService {
  private readonly api = inject(ApiService);

  list(): Observable<Contrato[]> {
    return this.api
      .get<PageResponse<Contrato>>('/contratos', { size: 1000 })
      .pipe(map(response => response.content ?? []));
  }

  create(payload: CreateContratoPayload, arquivo?: File): Observable<Contrato> {
    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (arquivo) {
      formData.append('arquivo', arquivo, arquivo.name);
    }
    return this.api.upload<Contrato>('/contratos/com-arquivo', formData);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/contratos/${id}`);
  }
}
