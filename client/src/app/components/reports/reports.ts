import { Component, signal } from '@angular/core';

import { ReportService } from '../../core/services/report';
import { ComparisonMonths, ReportBigExpense, ReportsChartDataCategory } from '../../core/models/reports';
import { AuthService } from '../../core/services/auth';


@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class ReportsComponent {
  expenseReports = signal<ReportsChartDataCategory['data'] | null>(null);
  incomeReports = signal<ReportsChartDataCategory['data'] | null>(null);
  average = signal<ReportBigExpense|null>(null);

  indexPrev: any;
  indexCurrent: any;
  comparisonMounth: any = signal('');

  comparisonMonthsIncomeData = signal<ComparisonMonths|null>(null);

  saldoAtual = signal<any>('');
  saldoAnterior = signal<any>('');

  constructor(protected reportService: ReportService, protected authService: AuthService) {};

  ngOnInit() {
    this.reportService.getReportsSummary().subscribe(reports => {
      this.reportService.reports.set(reports);
    });

    this.dataUser();
    this.expensesCategories();
    this.incomeCategories();
    this.BigExpense();
    this.Comparison();
    this.comparisonMonthsIncome();
  };

  expensesCategories() {
    this.reportService.getReportsChartDataCategory().subscribe(data => {
      if(data != false) {
        this.expenseReports.set(data);
      };
    })
  };

  incomeCategories() {
    this.reportService.getIncomeCategory().subscribe(data => {
      console.log('Icome categories', data);
      this.incomeReports.set(data);
    });
  };

  BigExpense() {
    this.reportService.getBigExpense().subscribe(data => {
      this.average.set(data);
    });
  };

  dataUser() {
    this.authService.getDataUser().subscribe(data => {
      console.log(data)
      this.authService.user.set(data);
    });
  }

  Comparison() {
    this.reportService.getReportsChartDataMountly().subscribe(data => {
      if(data === false) {
        // Sem dados para comparação
        return;
      };

      let report: any = data;
      const mounthComp = report.map((element: any, index: any) => {
        return element._id.mounthly;
        // return{
          //   mounth: element._id.mounthly,
          //   index: index
          // }
        });
        
        this.comparisonMounth.set(report);
        const maxValue = Math.max(...report.map((element: any) => element._id.mounthly));
        this.indexCurrent = mounthComp.findIndex((list: any) => list === maxValue);
        this.indexPrev = mounthComp.findIndex((list: any) => list === maxValue - 1);

        if(!this.comparisonMounth()[this.indexPrev]) {
          this.comparisonMounth()[this.indexPrev] = {total: 0};
        };
        
        console.log('COMPARISON', mounthComp);
        console.log('length',maxValue, this.indexCurrent, this.indexPrev);
    });
  };

  comparisonMonthsIncome() {
    this.reportService.ReportComparisonIncome().subscribe(data => {
      if(!data.prev) {
        this.comparisonMonthsIncomeData.set({current: data.current, prev: {total: 0}});
      }else {
        this.comparisonMonthsIncomeData.set(data);
      };
    });
  };
};
