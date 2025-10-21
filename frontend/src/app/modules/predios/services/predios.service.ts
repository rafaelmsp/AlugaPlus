import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Predio } from '../../../core/models/predio.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({ providedIn: 'root' })
export class PrediosService {
  private readonly api = inject(ApiService);

  list(): Observable<Predio[]> {
    return this.api
      .get<PageResponse<Predio>>('/predios', { size: 1000 })
      .pipe(map(response => response.content ?? []));
  }

  create(payload: Predio): Observable<Predio> {
    return this.api.post<Predio>('/predios', payload);
  }

  remove(id: number): Observable<void> {
    return this.api.delete<void>(`/predios/${id}`);
  }
}

