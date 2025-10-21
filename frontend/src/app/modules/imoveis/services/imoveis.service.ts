import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Imovel } from '../../../core/models/imovel.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({ providedIn: 'root' })
export class ImoveisService {
  private readonly api = inject(ApiService);

  list(): Observable<Imovel[]> {
    return this.api
      .get<PageResponse<Imovel>>('/imoveis', { size: 1000 })
      .pipe(map(response => response.content ?? []));
  }

  find(id: number): Observable<Imovel> {
    return this.api.get<Imovel>(`/imoveis/${id}`);
  }

  create(imovel: Partial<Imovel>): Observable<Imovel> {
    return this.api.post<Imovel>('/imoveis', imovel);
  }

  update(id: number, imovel: Partial<Imovel>): Observable<Imovel> {
    return this.api.put<Imovel>(`/imoveis/${id}`, imovel);
  }

  remove(id: number): Observable<void> {
    return this.api.delete<void>(`/imoveis/${id}`);
  }
}
























