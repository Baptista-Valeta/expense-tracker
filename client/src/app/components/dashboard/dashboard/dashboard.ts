import { Component, signal } from '@angular/core';

import { AuthService } from '../../../core/services/auth';
import { TransactionService } from '../../../core/services/transaction';
import { CategoryChart } from '../Charts/category-chart/category-chart';
import { MounthlyChart } from '../Charts/mounthly-chart/mounthly-chart';
import { ReportService } from '../../../core/services/report';

@Component({
  selector: 'app-dashboard',
  imports: [ CategoryChart, MounthlyChart ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor (protected reportService: ReportService, private authService: AuthService) {}

  ngOnInit() {
    this.onReports();
  };

  onReports() {
    this.reportService.getReportsSummary().subscribe({
      next: (reports => {
        this.reportService.reports.set(reports);
      })
    });
  };
};
