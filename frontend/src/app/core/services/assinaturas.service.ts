import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Assinatura, AssinaturaCheckoutResponse, FormaPagamento } from '../models/assinatura.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

export interface CriarAssinaturaPayload {
  planoId: number;
  formaPagamento: FormaPagamento;
}

@Injectable({ providedIn: 'root' })
export class AssinaturasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/assinaturas`;

  listar(page = 0, size = 20): Observable<PageResponse<Assinatura>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Assinatura>>(this.baseUrl, { params });
  }

  buscar(id: number): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.baseUrl}/${id}`);
  }

  minhaAssinatura(): Observable<Assinatura | null> {
    return this.http.get<Assinatura | null>(`${this.baseUrl}/me`);
  }

  criar(payload: CriarAssinaturaPayload): Observable<AssinaturaCheckoutResponse> {
    return this.http.post<AssinaturaCheckoutResponse>(this.baseUrl, payload);
  }

  cancelar(id: number): Observable<Assinatura> {
    return this.http.put<Assinatura>(`${this.baseUrl}/${id}/cancelar`, {});
  }
}
