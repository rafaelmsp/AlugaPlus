import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

interface DashboardSummary {
  totalImoveis: number;
  contratosAtivos: number;
  totalReceitasMes: number;
  totalDespesasMes: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);

  loadSummary(): Observable<DashboardSummary> {
    return forkJoin({
      imoveis: this.api.get<{ total: number }>('/imoveis?size=1&page=0'),
      contratos: this.api.get<{ totalAtivos: number }>('/contratos?status=ATIVO'),
      receitas: this.api.get<{ total: number }>('/financeiro?tipo=RECEITA&periodo=mensal'),
      despesas: this.api.get<{ total: number }>('/financeiro?tipo=DESPESA&periodo=mensal')
    }).pipe(
      map(({ imoveis, contratos, receitas, despesas }) => ({
        totalImoveis: imoveis?.total ?? 0,
        contratosAtivos: contratos?.totalAtivos ?? 0,
        totalReceitasMes: receitas?.total ?? 0,
        totalDespesasMes: despesas?.total ?? 0
      }))
    );
  }

  loadChartData(): Observable<any> {
    return this.api.get('/financeiro?groupBy=mes');
  }
}
























