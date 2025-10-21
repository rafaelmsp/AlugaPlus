export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'GESTOR' | 'INQUILINO';
  token?: string;
}
























