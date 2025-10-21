import { Predio } from './predio.model';

export interface Imovel {
  id?: number;
  endereco: string;
  tipo: string;
  valorAluguel: number;
  status: string;
  descricao?: string;
  fotoCapa?: string;
  dataCadastro?: string;
  predio?: Predio;
}
























