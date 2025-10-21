import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Usuario } from '../../../core/models/user.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly api = inject(ApiService);

  list(): Observable<Usuario[]> {
    return this.api
      .get<PageResponse<Usuario>>('/usuarios', { size: 1000 })
      .pipe(map(response => response.content ?? []));
  }
}

