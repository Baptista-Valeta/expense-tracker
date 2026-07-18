import { Component } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-category-chart',
  imports: [ NgxChartsModule ],
  templateUrl: './category-chart.html',
  styleUrl: './category-chart.css',
})
export class CategoryChart {
  results = [
    {name: 'Alimentação', value: 50000},
    {name: 'Electrónicos', value: 378000},
    {name: 'Viaturas', value: 156000},
    {name: 'Viagens', value: 750000},
    {name: 'Roupas', value: 17500},
    {name: 'Lanches', value: 12300},
    {name: 'Formações', value: 2450000},
  ];
  view: [number, number] = [700, 500];
  animations = true;
  labels = true;
  legend = true;
  doughnuts = true;
  title = 'Categorias';
};
