export type AssinaturaStatus = 'ATIVA' | 'CANCELADA' | 'EXPIRADA' | 'AGUARDANDO_PAGAMENTO';
export type FormaPagamento = 'PIX' | 'CARTAO' | 'BOLETO' | 'OUTRO';

export interface Assinatura {
  id?: number;
  usuarioId: number;
  planoId: number;
  planoNome?: string;
  dataInicio: string;
  dataFim?: string | null;
  status: AssinaturaStatus;
  formaPagamento: FormaPagamento;
  chavePix?: string | null;
  transacaoId?: string | null;
}

export interface AssinaturaCheckoutResponse {
  assinatura: Assinatura;
  pix?: PixCheckoutResponse | null;
}

export interface PixCheckoutResponse {
  chavePix: string;
  qrCode: string;
  valor: number;
  descricao: string;
}

