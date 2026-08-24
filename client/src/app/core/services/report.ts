import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, catchError, throwError } from 'rxjs';

import { ReportBigExpense, Reports, ReportsChartDataCategory, ReportsChartDataMouthly } from '../../core/models/reports';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  apiUrl = inject(AuthService).apiUrl;
  reports = signal<Reports['reports']|null>(null);

  constructor(private http: HttpClient,) {};

  getReportsSummary() {
    return this.http.get<Reports>(this.apiUrl+'reports/summary').pipe(
      map(reports => {
        return reports.reports;
      }),
      catchError(error => {
        console.log('Erro ao buscar dados para de reports!', error);
        return throwError(() => error);
      })
    );
  };


  getReportsChartDataCategory() {
    return this.http.get<ReportsChartDataCategory>(this.apiUrl+'reports/chart-data-category').pipe(
      map(data => {
        if (!data.data[0]) {
          return false
        };
        console.log('Chart category', data)
        return data.data;
      }),
      catchError(error => {
        console.error('Erro em buscar dados para o gráfico de gastos por categoria!', error);
        return throwError(() => error);
      })
    );
  };

  getReportsChartDataMountly() {
    return this.http.get<ReportsChartDataMouthly>(this.apiUrl+'reports/chart-data-mounthly').pipe(
      map(data => {
        if(!data.data[0]) {
          return false
        };
        console.log('Chart mounth', data)
        // console.log('Chart-Data-Mounthly',chartData);
        return data.data;
      }),
      catchError(error => {
        console.log('Erro ao buscar dados para o gráfico de gastos mensal!', error);
        return throwError(() => error);
      })
    );
  };

  getIncomeCategory() {
    return this.http.get<ReportsChartDataCategory>(this.apiUrl+'reports/category-income').pipe(
      map(datas => {
        return datas.data;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  };

  getBigExpense() {
    return this.http.get<ReportBigExpense>(this.apiUrl+'reports/average').pipe(
      catchError(error => {
        if(error.status == 404) {
          return throwError(() => 'Sem dados para média das transações');
        }
        return throwError(() => error);
      })
    )
  };
};
 