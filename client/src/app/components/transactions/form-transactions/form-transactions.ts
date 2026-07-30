import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';

import * as bootstrap from 'bootstrap';

import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';
import { Transactions } from '../transactions';

@Component({
  selector: 'app-form-transactions',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-transactions.html',
  styleUrl: './form-transactions.css',
})
export class FormTransactions {
  categoryList = <any|null>signal([]);
  user: any;
  modal = 'static'; 

  transactionsForm = new FormGroup({
    amount: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    type: new FormControl('income', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    newCategory: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    description: new FormControl('', []),
  });

  get amount() {
    return this.transactionsForm.get('amount');
  };

  get type() {
    return this.transactionsForm.get<string>('type');
  };

  get category() {
    return this.transactionsForm.get<string>('category');
  };

  get newCategory() {
    return this.transactionsForm.get<string>('newCategory');
  };

  get description() {
    return this.transactionsForm.get<string>('description');
  }

  constructor(private transactionService: TransactionService, private authService: AuthService, private transactions: Transactions) {}

  ngOnInit() {
    this.getUserId();
    this.getAllCategories();

    // console.log('[ONE]', this.categoryId())
  };

  getAllCategories() {
    this.transactionService.getAllCategory().subscribe({
      next: (categories) => {
        this.categoryList.set(categories);
      },
      error: err => {
        console.error(err)
      }
    });
  }

  getUserId() {
    this.authService.getDataUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }

  createTransaction () {
    this.transactions.closeModal();
    
    this.amount?.markAsTouched();
    this.type?.markAsTouched();
    this.category?.markAsTouched();

    if(this.amount?.invalid || this.type?.invalid || this.category?.invalid) {
      console.info('Formulário inválido');
      return;
    };
      
    let isCategory: string = this.category?.value;
    let payload: any;

    if(this.category?.value === 'Outra') {
      this.newCategory?.markAsTouched();
      if(this.newCategory?.invalid) {
        console.log('[NewCategory] Invalid');
        return;
      };

      isCategory = this.newCategory?.value;
      // Criar categoria primeiro
      this.transactionService.createCategory({name: isCategory, user: this.user._id}).subscribe({
        next: (category) => {
          let categoryId: any = category;
          
          payload = {
            amount:  Number(this.amount?.value),
            category: categoryId._id,
            type: this.type?.value,
            user: this.user._id,
            description: this.description?.value
          };

          console.log('[PAYLOAD]', payload);

          // Criar transação quando não existe categoria
          this.transactionService.createTransaction(payload).subscribe({
            next: transaction => {}
          });
          this.transactions.ngOnInit(); // Atualiza a lista de transações
        }
      });
      this.getAllCategories(); // Atualiza a lista de categorias
      this.closeForm();
      return;
    };

    payload = {
      amount:  Number(this.amount?.value),
      category: isCategory,
      type: this.type?.value,
      user: this.user._id,
      description: this.description?.value
    };
    
    console.log('[CATEGORYID]: ', isCategory, '\n [USERID] ' + this.user._id);   
    console.log('[PAYLOAD]', payload);
    // Criar transação quando existe categoria
    this.transactionService.createTransaction(payload).subscribe({
      next: transaction => {}
    });
    this.transactions.ngOnInit(); // Atualiza a lista de transações
  };

  closeForm() {
    // this.modal?.hide();
    this.transactionsForm.reset();
    this.type?.setValue('income');
    this.category?.setValue('');
  }
};
