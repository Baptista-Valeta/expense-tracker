import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

interface Reports {
  message: string,
  reports: {
    saldo: number,
    total_Entrado: number,
    total_Saido: number
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
      tap(reports => {
        console.log(reports.message+' : '+reports.reports);
      }),
      map(reports => {
        return reports.reports;
      })
    )
  }
}
