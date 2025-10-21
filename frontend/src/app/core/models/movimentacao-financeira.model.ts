export interface MovimentacaoFinanceira {
  id?: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  descricao?: string;
  valor: number;
  data: string;
  imovelId?: number;
  contratoId?: number;
  comprovante?: string;
  status: string;
  formaPagamento?: string;
  referencia?: string;
}
























