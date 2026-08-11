import { Component, signal, ViewChild, inject } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';

import * as bootstrap from 'bootstrap';

import { TransactionService } from '../../core/services/transaction';
import { FormTransactions } from './form-transactions/form-transactions';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-transactions',
  imports: [ DatePipe, FormTransactions ],
  // providers: [FormTransactions],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  @ViewChild(FormTransactions) formTransaction!: FormTransactions;

  constructor(
    public transactionService: TransactionService,
    public authService: AuthService,
    private toast: ToastrService
  ) {};  

  ngOnInit() {
    this.userData();
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.transactionService.transactions.set(transactions);
      // console.log('Transações',this.transactions())
    });
  };

  userData() {
    this.authService.getDataUser().subscribe(data => {
      this.authService.user.set(data);
    });
  };

  deleteTransaction(id: string) {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta transação?');
    if(confirmDelete) {
      // Remove transação
      this.transactionService.RemoveTransaction(id).subscribe(message => {
        this.toast.show(message);
        
      });

      // Atualiza a lista de transações
      this.transactionService.getTransactions().subscribe({
        next: data => {
          this.transactionService.transactions.set(data);
        }
      });
    };

  };

  openModal(transactions: any) {
    console.log('Transações', transactions);

    this.formTransaction.titleForm = 'Adicionar nova Transação'
    this.formTransaction.buttonText = 'Adicionar'

    if(transactions) {
      this.formTransaction.titleForm = 'Atualizar Transação'
      this.formTransaction.buttonText = 'Atualizar'

      const type = transactions.type === 'receita'?'income':'expense';
      const indexCategory = this.formTransaction.categoryList().findIndex((category: any) => category.name === transactions.category);
      
      const categoryId = this.formTransaction.categoryList()[indexCategory]._id;

      this.formTransaction.transactionsForm.setValue({
        id: transactions._id,
        amount: transactions.amount,
        type: type,
        category: categoryId,
        newCategory: '',
        description: transactions.description
      });
    };
    
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop')!);
    modal.show();
  };

}
