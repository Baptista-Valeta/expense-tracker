import { Component, signal, ViewChild, inject, DOCUMENT, Inject } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { Form, FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";

import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

import { TransactionService } from '../../core/services/transaction';
import { FormTransactions } from './form-transactions/form-transactions';
import { AuthService } from '../../core/services/auth';
import { AllTransactions } from '../../core/models/transactions';
import { CategoryService } from '../../core/services/category';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-transactions',
  imports: [FormTransactions, ɵInternalFormsSharedModule, ReactiveFormsModule],
  // providers: [FormTransactions],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  @ViewChild(FormTransactions) formTransaction!: FormTransactions;

  filterType: FormControl = new FormControl('', []);
  filterCategory: FormControl = new FormControl('', []);
  filterDate: FormControl = new FormControl('', []);

  dates = signal<any|null>(null);
  uniqueDates = signal<any|null>(null)

  renderer = inject(ThemeService).renderer
  rendererFactory = inject(ThemeService).rendererFactory;

  constructor(
    protected transactionService: TransactionService,
    protected authService: AuthService,
    private toast: ToastrService,
    protected categoryService: CategoryService,
    @Inject(DOCUMENT) private document: Document
  ) {};  

  ngOnInit() {
    // console.log(this.renderer, this.rendererFactory)
    window.location.reload;
    this.userData();
    this.transactionService.getTransactions().subscribe({
      next: (transactions => {
        this.transactionService.transactions.set(transactions);
        const allDates = this.transactionService.transactions()?.map(dates => dates.date);
        const formatDates = [...new Set(allDates)];
        
        this.dates.set(formatDates);
        // console.log('Transações',this.transactions())
      }),
      error: (error => {
        if(error.status === 404) {
          this.transactionService.transactions.set(null);
        }
      })
    });
    
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
    const valueElement = e.target as HTMLInputElement; 
    let list_filtered: any;
    let element: string|Date;
    const containerTable = this.document.querySelector('.container-table');
    const table = containerTable?.firstElementChild;
    const newChild = this.document.querySelector('#no-transactions') as HTMLDivElement;
    let text: any = `Sem ${this.filterType.value} na categoria ${this.filterCategory.value}`;          

    this.transactionService.getTransactions().subscribe((transactions) => {
      this.transactionService.transactions.set(transactions);

      // Reseta os filtros
      if(valueElement.value === 'Todos') {
        this.filterType.setValue('');
        this.filterCategory.setValue('');
        this.filterDate.setValue('');
        this.renderer.removeClass(table, 'd-none');
        this.renderer.addClass(newChild, 'd-none');
        return;
      };
      
      // Filtrar por tipo          
      if(this.filterType.value) { 
        element = this.filterType.value;
        list_filtered = this.transactionService.transactions()?.filter(transaction => transaction.type === element);
        this.transactionService.transactions.set(list_filtered)
        // console.log('Por Tipo',list_filtered);
      };

      // Filtrar por data
      if(this.filterDate.value) {
        element = this.filterDate.value
        list_filtered = this.transactionService.transactions()?.filter(transaction => transaction.date === element);
        if(list_filtered.length === 0) {
          text = `Sem ${this.filterType.value} para essa data!`;          
          // Adiciona uma mensagem na tela caso a lista for vazia
          newChild.textContent = text;
          this.renderer.addClass(table, 'd-none'); // Oculta a tabela
          this.renderer.removeClass(newChild, 'd-none');
          
          // console.log(text);
          return;
        };

        this.transactionService.transactions.set(list_filtered)
      };
      
      // Filtrar por categoria
      if(this.filterCategory.value) {
        element = this.filterCategory.value;
        list_filtered = this.transactionService.transactions()?.filter(transaction => transaction.category === element);
        
        // Retorna a execução caso não a lista for vazia
        if(list_filtered.length === 0 ) {
          // Adiciona uma mensagem na tela caso a lista for vazia
          const type = this.filterType.value?this.filterType.value:'transações';
          text = `Sem ${type} na categoria ${this.filterCategory.value}`;

          newChild.textContent = text;
          this.renderer.addClass(table, 'd-none'); // Oculta a tabela
          this.renderer.removeClass(newChild, 'd-none');
          
          return;
        };

        this.transactionService.transactions.set(list_filtered);
      };
      this.renderer.removeClass(table, 'd-none');
      this.renderer.addClass(newChild, 'd-none');
    });
  };
}
