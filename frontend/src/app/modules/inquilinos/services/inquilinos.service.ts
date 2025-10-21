import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Inquilino } from '../../../core/models/inquilino.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({ providedIn: 'root' })
export class InquilinosService {
  private readonly api = inject(ApiService);

  list(): Observable<Inquilino[]> {
    return this.api
      .get<PageResponse<Inquilino>>('/inquilinos', { size: 1000 })
      .pipe(map(response => response.content ?? []));
  }

  find(id: number): Observable<Inquilino> {
    return this.api.get<Inquilino>(`/inquilinos/${id}`);
  }

  create(payload: Partial<Inquilino>): Observable<Inquilino> {
    return this.api.post<Inquilino>('/inquilinos', payload);
  }

  update(id: number, payload: Partial<Inquilino>): Observable<Inquilino> {
    return this.api.put<Inquilino>(`/inquilinos/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.api.delete<void>(`/inquilinos/${id}`);
  }
}
























