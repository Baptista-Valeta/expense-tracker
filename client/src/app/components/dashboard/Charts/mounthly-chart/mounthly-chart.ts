import { Component, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TransactionService } from '../../../../core/services/transaction';

@Component({
  selector: 'app-mounthly-chart',
  imports: [ NgxChartsModule ],
  templateUrl: './mounthly-chart.html',
  styleUrl: './mounthly-chart.css',
})
export class MounthlyChart {
  results = signal<any|null>(null);
  view: [number, number] = [700, 500];
  legend = false; 
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Meses';
  yAxisLabel = 'Valor (kz)';
  animations = true;
  // titleLegend = 'Ano 2026'
  autoScale = false;
  roundDomais = true;
  showGrideLines = true;

  constructor(private transactionService: TransactionService) {};

  ngOnInit() {
    this.chartMounthlyBar();
  };

  chartMounthlyBar() {
    this.transactionService.getReportsChartDataMountly().subscribe({
      next: (data) => {
        if(data.data === false) {
          console.log('Sem dados para o gráfico!');
          return;
        };
        this.results.set(data);
        console.log('Chart-Data-Mounthly', this.results());
      }
    });
  };  
};