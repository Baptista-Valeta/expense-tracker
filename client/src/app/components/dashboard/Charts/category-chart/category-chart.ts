import { Component, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ReportService } from '../../../../core/services/report';

@Component({
  selector: 'app-category-chart',
  imports: [ NgxChartsModule ],
  templateUrl: './category-chart.html',
  styleUrl: './category-chart.css',
})
export class CategoryChart {
  results = signal<any|null>(null);
  style = 'white'
  view: [number, number] = [700, 500];
  animations = true;
  labels = true;
  legend = true;
  doughnuts = true;
  title = 'Categorias';
  scheme = {
    domain: [
      '#2563eb',
      '#16a34a',
      '#dc2626',
      '#f59e0b',
      '#8b5cf6'
    ]
};

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.chartCategoryPie();
  }
  
  chartCategoryPie() {    
    return this.reportService.getReportsChartDataCategory().subscribe({
      next: (data) => {
        if(data === false) {
          // console.log('Sem dados para construir o gráfico');
          return;
        };
        let chartData: any = [];
        data.forEach(categories => {
          chartData.push({
            name: categories.category,
            value: categories.total
          });
        })
        this.results.set(chartData);
      },
    });
  };
};
