import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PagamentoResumo } from '../../contratos/components/pagamento-list.component';

export interface PortalContrato {
  id: number;
  imovelDescricao: string;
  status: string;
  valorMensal?: number;
  proximaVistoria?: string;
  pagamentos: PagamentoResumo[];
}

interface ContratoResponse {
  id: number;
  imovelDescricao: string;
  status: string;
  valorMensal?: number;
}

interface PagamentoResponse {
  id: number;
  contratoId: number;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class PortalInquilinoService {
  private readonly api = inject(ApiService);

  listarContratos(): Observable<PortalContrato[]> {
    return this.api.get<ContratoResponse[]>('/portal/contratos').pipe(
      switchMap(contratos => {
        if (!contratos.length) {
          return of([] as PortalContrato[]);
        }
        return forkJoin(contratos.map(contrato => this.api
          .get<PagamentoResponse[]>(`/portal/contratos/${contrato.id}/pagamentos`)
          .pipe(map(pagamentos => this.mapContrato(contrato, pagamentos)))));
      })
    );
  }

  enviarComprovante(pagamentoId: number, arquivo: File) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.api.upload(`/portal/pagamentos/${pagamentoId}/comprovante`, formData);
  }

  private mapContrato(contrato: ContratoResponse, pagamentos: PagamentoResponse[]): PortalContrato {
    return {
      id: contrato.id,
      imovelDescricao: contrato.imovelDescricao ?? `Contrato #${contrato.id}`,
      status: contrato.status,
      valorMensal: contrato.valorMensal,
      pagamentos: pagamentos.map(p => ({
        id: p.id,
        vencimento: p.dataVencimento,
        valor: p.valor,
        status: p.status,
        dataPagamento: p.dataPagamento || undefined
      }))
    };
  }
}
