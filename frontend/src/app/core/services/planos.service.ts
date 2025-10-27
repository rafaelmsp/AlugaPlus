import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plano } from '../models/plano.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class PlanosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/planos`;

  listPublic(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.baseUrl);
  }

  listAdmin(page = 0, size = 20): Observable<PageResponse<Plano>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Plano>>(`${this.baseUrl}/admin`, { params });
  }

  find(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.baseUrl}/${id}`);
  }

  create(payload: Plano): Observable<Plano> {
    return this.http.post<Plano>(this.baseUrl, payload);
  }

  update(id: number, payload: Plano): Observable<Plano> {
    return this.http.put<Plano>(`${this.baseUrl}/${id}`, payload);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
