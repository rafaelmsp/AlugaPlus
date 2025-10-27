export interface Contrato {
  id?: number;
  imovelId?: number;
  inquilinoId?: number;
  imovelDescricao?: string | null;
  inquilinoNome?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  valorMensal: number;
  status: string;
  arquivoPdf?: string | null;
  hashDocumento?: string | null;
  dataUpload?: string | null;
  observacao?: string | null;
}

