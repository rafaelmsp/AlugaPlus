import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/user.model';

interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  role: Usuario['role'];
}

interface AuthCredentials {
  email: string;
  senha: string;
}

interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  role: Usuario['role'];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'alugaplus_auth';

  private readonly _user$ = new BehaviorSubject<Usuario | null>(this.readStorage());
  readonly user$ = this._user$.asObservable();

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.persistUser(res))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap(res => this.persistUser(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this._user$.next(null);
  }

  getToken(): string | null {
    return this.readStorage()?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.readStorage();
  }

  private persistUser(response: AuthResponse): void {
    const user: Usuario = {
      nome: response.nome,
      email: response.email,
      role: response.role,
      token: response.token
    };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this._user$.next(user);
  }

  private readStorage(): Usuario | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }
}
























