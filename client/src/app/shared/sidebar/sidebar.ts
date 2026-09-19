import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(protected reportService: ReportService, private toastr: ToastrService) {};

  exportDataTransactions() {
    this.reportService.exportTransactions().subscribe({
      next: file => {
        // Cria uma url temporário para acessar o conteúdo do 'file'
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');

        link.click();
        URL.revokeObjectURL(url) // Informa ao navegador que a url temporária deixa de ser usada
      },
      error: err => {
        console.error('Erro ao exportar dados:', err.message);
      }
    })
  };
}
