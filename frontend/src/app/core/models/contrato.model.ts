import { Imovel } from './imovel.model';
import { Inquilino } from './inquilino.model';
import { Pagamento } from './pagamento.model';

export interface Contrato {
  id?: number;
  imovel: Imovel;
  inquilino: Inquilino;
  dataInicio: string;
  dataFim?: string;
  valorMensal: number;
  status: string;
  arquivoPdf?: string;
  hashDocumento?: string;
  dataUpload?: string;
  observacao?: string;
  pagamentos?: Pagamento[];
}
























