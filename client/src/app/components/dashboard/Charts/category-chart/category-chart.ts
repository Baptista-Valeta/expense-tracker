import { Component, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TransactionService } from '../../../../core/services/transaction';

@Component({
  selector: 'app-category-chart',
  imports: [ NgxChartsModule ],
  templateUrl: './category-chart.html',
  styleUrl: './category-chart.css',
})
export class CategoryChart {
  results = signal<any|null>(null);

  view: [number, number] = [700, 500];
  animations = true;
  labels = true;
  legend = true;
  doughnuts = true;
  title = 'Categorias';

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.chartCategoryPie();
  }
  
  chartCategoryPie() {    
    return this.transactionService.getReportsChartDataCategory().subscribe({
      next: (data) => {
        if(data === false) {
          console.log('Sem dados para construir o gráfico');
          return;
        }
        console.log('Data',data)
        
        this.results.set(data);
        console.log(this.results())
      },
      error: (err) => {
        console.error('Erro em chart-data', err)
      }
    });
  };
};
