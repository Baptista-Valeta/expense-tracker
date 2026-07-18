import { Component } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-mounthly-chart',
  imports: [ NgxChartsModule ],
  templateUrl: './mounthly-chart.html',
  styleUrl: './mounthly-chart.css',
})
export class MounthlyChart {
  results = [
    {name: 'Janeiro', value: 64500},
    {name: 'Fevereiro', value: 22500},
    {name: 'Março', value: 23450},
    {name: 'Abril', value: 15000},
    {name: 'Maio', value: 75000},
    {name: 'Junho', value: 183000},
    {name: 'Julho', value: 30000},
    {name: 'Agosto', value: 64500},
    {name: 'Setembro', value: 22500},
    {name: 'Outubro', value: 23450},
    {name: 'Novembro', value: 15000},
    {name: 'Dezembro', value: 75000},
  ];
  view: [number, number] = [700, 500];
  legend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Meses';
  yAxisLabel = 'Valor (kz)';
  animations = true;
  titleLegend = 'Ano 2026'
  autoFocus = true;
  roundDomais = true;
  showGrideLines = true;
};
