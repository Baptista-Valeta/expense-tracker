import { Component, signal, ViewChild, inject } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';

import * as bootstrap from 'bootstrap';

import { TransactionService } from '../../core/services/transaction';
import { FormTransactions } from './form-transactions/form-transactions';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth';
import { AllTransactions } from '../../core/models/transactions';
import { Form, FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { CategoryService } from '../../core/services/category';

@Component({
  selector: 'app-transactions',
  imports: [DatePipe, FormTransactions, ɵInternalFormsSharedModule, ReactiveFormsModule],
  // providers: [FormTransactions],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  @ViewChild(FormTransactions) formTransaction!: FormTransactions;

  filterType: FormControl = new FormControl('', []);
  filterCategory: FormControl = new FormControl('', []);
  filterDate: FormControl = new FormControl('', []);

  constructor(
    protected transactionService: TransactionService,
    protected authService: AuthService,
    private toast: ToastrService,
    protected categoryService: CategoryService
  ) {};  

  ngOnInit() {
    this.userData();
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.transactionService.transactions.set(transactions);

      const allDate = transactions.filter(transaction => transaction.date);

      let categories: any = [...new Set(allDate.map(t => t.date))]
      const dat = new Date().getDate()
      // console.log('Transações',this.transactions())
    });

    // Lista de todas as categorias, para o filtro
    this.categoryService.getAllCategory().subscribe(categories => this.categoryService.categories.set(categories));
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
        this.toast.info(message);
        
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
      
      let indexCategory;
      let categoryId;
    
      if(!transactions.category) {
        categoryId = '';
      }else {
        indexCategory = this.formTransaction.categoryList().findIndex((category: any) => category.name === transactions.category);
        categoryId = this.formTransaction.categoryList()[indexCategory]._id;
      };
      

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

  filters(e: Event) {

    console.log('TYPE', this.filterType.value);
    console.log('DATE', this.filterDate.value);
    console.log('CATEGORY', this.filterCategory.value);

  };

}
