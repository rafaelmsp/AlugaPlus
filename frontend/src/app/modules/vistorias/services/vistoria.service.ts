import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VistoriaDto {
  id?: number;
  imovelId: number;
  imovelEndereco?: string;
  contratoId?: number;
  dataVistoria: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'ROTINA';
  observacoes?: string;
  avaliacao?: number;
  fotos?: string[];
}

@Injectable({ providedIn: 'root' })
export class VistoriaService {
  private readonly api = inject(ApiService);

  list(): Observable<VistoriaDto[]> {
    const apiBase = environment.apiUrl.replace(/\/$/, '');
    const buildFotoUrl = (foto: string): string => {
      if (!foto) {
        return foto;
      }
      if (foto.startsWith('http')) {
        return foto;
      }
      return foto.startsWith('/') ? `${apiBase}${foto}` : `${apiBase}/${foto}`;
    };

    return this.api.get<{ content: VistoriaDto[] }>('/vistorias', { size: 1000 })
      .pipe(
        map(response => (response.content ?? []).map(vistoria => ({
          ...vistoria,
          fotos: vistoria.fotos?.map(buildFotoUrl)
        })))
      );
  }

  criar(dto: VistoriaDto): Observable<VistoriaDto> {
    return this.api.post<VistoriaDto>('/vistorias', dto);
  }

  uploadFotos(id: number, fotos: File[]): Observable<VistoriaDto> {
    const formData = new FormData();
    fotos.forEach(foto => {
      formData.append('fotos', foto);
    });
    return this.api.upload<VistoriaDto>(`/vistorias/${id}/fotos`, formData);
  }
}
