import { Usuario } from './user.model';

export interface Inquilino {
  id?: number;
  nome: string;
  cpf: string;
  telefone?: string;
  email: string;
  endereco?: string;
  observacoes?: string;
  usuario?: Usuario;
}
























