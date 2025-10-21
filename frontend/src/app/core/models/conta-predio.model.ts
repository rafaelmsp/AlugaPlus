export interface ContaPredio {
  id?: number;
  predioId: number;
  tipo: string;
  valor: number;
  mesReferencia: number;
  anoReferencia: number;
  vencimento: string;
  dataPagamento?: string;
  comprovante?: string;
  status: string;
  recorrente: boolean;
  observacao?: string;
}
























