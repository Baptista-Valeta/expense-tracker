import { Component, signal } from '@angular/core';

import { AuthService } from '../../../core/services/auth';
import { TransactionService } from '../../../core/services/transaction';

interface Reports {
  saldo: number,
  total_Entrado: number,
  total_Saido: number
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  reports = signal<Reports|null>(null);

  constructor (private transacionService: TransactionService, private authService: AuthService) {}

  ngOnInit() {

    this.onReports();
  };


  onReports() {
    this.transacionService.getReportsSummary().subscribe({
      next: (reports => {
        this.reports.set(reports);
        console.log('Signal Reports', this.reports());
      })
    });
  };
};
