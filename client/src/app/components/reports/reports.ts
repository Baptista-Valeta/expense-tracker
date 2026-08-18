import { Component, signal } from '@angular/core';

import { ReportService } from '../../core/services/report';
import { ReportsChartDataCategory } from '../../core/models/reports';


@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class ReportsComponent {
  expenseReports = signal<ReportsChartDataCategory['data'] | null>(null);

  constructor(protected reportService: ReportService) {};

  ngOnInit() {
    this.reportService.getReportsSummary().subscribe(reports => {
      this.reportService.reports.set(reports);
    });

    this.expensesCategories();
  };

  expensesCategories() {
    this.reportService.getReportsChartDataCategory().subscribe(data => {
      if(data != false) {
        this.expenseReports.set(data);
      };
    })
  };
};
