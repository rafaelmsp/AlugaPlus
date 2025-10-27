export interface Plano {
  id?: number;
  nome: string;
  descricao?: string;
  valorMensal: number;
  qtdeUsuarios?: number | null;
  qtdeImoveis?: number | null;
  qtdeContratos?: number | null;
  recursosExtras?: string;
  ativo: boolean;
}

