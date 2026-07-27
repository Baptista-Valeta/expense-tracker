import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

interface Reports {
  message: string,
  reports: {
    saldo: number,
    total_Entrado: number,
    total_Saido: number
  }
};

interface ReportsChartDataCategory {
  message: string,
  data: [
    {
      category: string,
      total: number
    }
  ]
};

interface ReportsChartDataMouthly {
  message: string;
  data: [
    {
      total: number, // gasto total em cada mês
      _id: {
        mounthly: number,
        year: number
      }
    }
  ]
};

interface Transactions {
  message: string;
  transaction: [
    {
      _id: string,
      amount: number,
      category: string,
      type: string,
      description: string,
      date: Date,
      createdAt: Date,
      updatedAt: Date
    }
  ]
};

interface Categories {
  message: string;
  categories: [
    {
      _id: string,
      name: string,
      user: string
    }
  ]
};

interface createdCategory {
  message: string;
  categories: {
    _id: string,
    name: string,
    user: string
  }
};

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  apiUrl: string = inject(AuthService).apiUrl;

  constructor(private http: HttpClient) {}
  
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
        let chartData: any = [];
        data.data.forEach(categories => {
          chartData.push({
            name: categories.category,
            value: categories.total
          });
        })
        return chartData;
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
        let chartData: any = [];
        let mounthlyValues: any = [];
        let month: string;
        data.data.forEach((values, index) => {
          switch(values._id.mounthly) {
            case 1: // Janeiro
              month = 'Janeiro';
              break;
            case 2: // Fevereiro
              month = 'Fevereiro';
              break;
            case 3: // Março
              month = 'Março';
              break;
            case 4: // Abril
              month = 'Abril';
              break;
            case 5: // Maio
              month = 'Maio';
              break;
            case 6: // Junho
              month = 'Junho';
              break;
            case 7: // Julho
              month = 'Julho';
              break;
            case 8: // Agosto
              month = 'Agosto';          
              break;
            case 9: // Setembro
              month = 'Setembro';
              break;
            case 10: // Outubro
              month = 'Outubro';
              break;
            case 11: // Novembro
              month = 'Novembro';
              break;
            default: // Dezembro
              month = 'Dezembro';
              break;
          };

          mounthlyValues.push({name: month, value: values.total});
          chartData.push({name: `Ano ${values._id.year}`, series: mounthlyValues});
        });
        // console.log('Chart-Data-Mounthly',chartData);
        return chartData;
      }),
      catchError(error => {
        console.log('Erro ao buscar dados para o gráfico de gastos mensal!', error);
        return throwError(() => error);
      })
    );
  };

  createCategory(payload: any) {
    return this.http.post<Categories['categories'][0]>(this.apiUrl+'categories', payload).pipe(
      map(category => {
        console.log('Create Category', category);
        return category;
      }),
      catchError(error => {
        if(error.status === 400) {
          console.error('Erro ao criar categoria', error);
          return throwError(() => 'Campo Inválido');
        };
        return throwError(() => error.message);
      })
    );
  };

  getAllCategory() {
    return this.http.get<Categories>(this.apiUrl+'categories').pipe(
      map(categories => {
        console.log('Todas as categorias', categories.categories);
        return categories.categories;
      }),
      catchError(error => {
        if(error.status === 404) {
          return throwError(() => 'Nenhuma categoria encontrada');
        };
        console.error('Erro ao buscar categoria:', error)
        return throwError(() => error);
      })
    );
  };

  getTransactions() {
    return this.http.get<Transactions>(this.apiUrl+'transactions').pipe(
      map(transactions => {
        return transactions.transaction;
      }),
      catchError(error => {
        if(error.status === 404) {
          // console.error('Nenhuma transação encontrada:', error);
          return throwError(() => "Nenhuma transação encontrada");
        }
        return throwError(() => error);
      })
    );
  };
};