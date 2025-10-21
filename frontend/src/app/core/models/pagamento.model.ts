export interface Pagamento {
  id?: number;
  contratoId: number;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  status: string;
  formaPagamento: string;
  observacao?: string;
  comprovante?: string;
}
























