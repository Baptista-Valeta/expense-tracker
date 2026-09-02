import { Component, signal } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ReportService } from '../../../../core/services/report';

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

  constructor(private reportService: ReportService) {};

  ngOnInit() {
    this.chartMounthlyBar();
  };

  chartMounthlyBar() {
    this.reportService.getReportsChartDataMountly().subscribe({
      next: (data) => {
        if(data === false) {
          console.log('Sem dados para o gráfico!');
          return;
        };

        let chartData: any = [];
        let mounthlyValues: any = [];
        let month: string;
        data.forEach((values, index) => {
          // for() {}  // Para ordenar o array de gastos mensais
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
          // console.log(month)
          chartData.push({name: `Ano ${values._id.year}`, series: mounthlyValues});
        });
        this.results.set(chartData);
        console.log('Chart-Data-Mounthly', this.results());
      }
    });
  };  
};