import { Component, signal, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import * as bootstrap from 'bootstrap';

import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';
import { Transactions } from '../transactions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-transactions',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-transactions.html',
  styleUrl: './form-transactions.css',
})
export class FormTransactions {
  categoryList = <any|null>signal([]);
  modal = 'static'; 

  titleForm = 'Adicionar nova transação';
  buttonText = 'Adicionar';

  fb = inject(FormBuilder); // pra inserir valor a partir de outro componente

  transactionsForm: FormGroup = this.fb.group({
    id: new FormControl(''),
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

  constructor(
    private transactionService: TransactionService, 
    private authService: AuthService, 
    private toast: ToastrService  
  ) {};

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
    this.authService.getDataUser().subscribe((user) => {
      this.authService.user.set(user);
    });
  };

  createCategory(isCategory: string, payload: any, amount: number, type: string, description: string) {
    this.newCategory?.markAsTouched();


    if(this.newCategory?.invalid) {
      console.log('[NewCategory] Invalid');
      return;
    };

    isCategory = this.newCategory?.value;

    this.transactionService.createCategory({name: isCategory, user: this.authService.user()._id}).subscribe({
      next: (category) => {
        let categoryId: any = category;
        
        payload = {
          amount:  amount,
          category: categoryId._id,
          type: type,
          user: this.authService.user()._id,
          description: description
        };
        
        console.log('[PAYLOAD]', payload);
        
        // Criar transação quando não existe categoria
        this.transactionService.createTransaction(payload).subscribe({
          next: transaction => {
            this.toast.success('Transação realizada');
          },
          error: err => {
            if(err === 'Saldo insuficiente') {
              this.toast.error('Saldo insuficiente!');
            };
          }
        });
        this.transactionService.getTransactions().subscribe(data => {
          this.transactionService.transactions.set(data);// Atualiza a lista de transações
        });
      }
    });
    this.getUserId();
    console.log('[USER DATA', this.authService.user().saldo);
    this.getAllCategories(); // Atualiza a lista de categorias
    this.closeForm();
    this.transactionService.closeModal();  // Fechar o modal

    return;
  };

  createTransaction () {    
    console.log('[_ID]',this.transactionsForm.get('id')?.value,!this.transactionsForm.get('id')?.value)
    console.log('[FORM VALUE]',this.transactionsForm.value);
    console.log('[USER DATA', this.authService.user().saldo);

    this.amount?.markAsTouched();
    this.type?.markAsTouched();
    this.category?.markAsTouched();
    
    let isCategory: string = this.category?.value;
    let amount = this.amount?.value;
    let type = this.type?.value;
    let description = this.description?.value;
    let payload: any;
    
    if(this.amount?.invalid || this.type?.invalid || this.category?.invalid) {
      console.info('Formulário inválido');
      return;
    };

    if(!this.transactionsForm.get('id')?.value) {
      // Create Transaction
      console.log('[Payload 2]', amount,type,description,isCategory);
      
      if(this.category?.value === 'Outra') {
        // Criar categoria primeiro
        this.createCategory(isCategory, payload, amount, type, description);
        return;
      };
      
      payload = {
        amount:  amount,  
        category: isCategory,
        type: type,
        user: this.authService.user()._id,
        description: description
      };
      
      console.log('[PAYLOAD]', payload);
      
      // Criar transação quando existe categoria
      this.transactionService.createTransaction(payload).subscribe({
        next: transaction => {
          this.toast.success('Transação realizada');
        },
        error: err => {
          if(err === 'Saldo insuficiente') {
            this.toast.error('Saldo insuficiente!');
          };
        }
      });
      
      this.getUserId(); // Atualiza saldo do usuário      
      console.log('[USER DATA', this.authService.user().saldo);
      this.transactionService.getTransactions().subscribe(data => {
        this.transactionService.transactions.set(data); // Atualiza a lista de transações
      });
    }else {
      // Update Transaction
      console.log('[UPDATE]',this.transactionsForm.value);
      console.log('[UPDATE]',this.category?.value);

      if(this.category?.value === 'Outra') {
        // Criar categoria primeiro

        return;
      };

    };
    this.closeForm();
    this.transactionService.closeModal();
  };

  closeForm() {
    // this.modal?.hide();
    this.transactionsForm.reset();
    this.type?.setValue('income');
    this.category?.setValue('');
  }
};
