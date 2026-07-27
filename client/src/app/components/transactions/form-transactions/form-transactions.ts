import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-form-transactions',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-transactions.html',
  styleUrl: './form-transactions.css',
})
export class FormTransactions {
  categoryList = <any|null>signal([]);
  user: any;
  categoryId: any;

  transactionsForm = new FormGroup({
    amount: new FormControl('', []),
    type: new FormControl('income', []),
    category: new FormControl('', []),
    newCategory: new FormControl('', []),
    description: new FormControl('', []),
  });

  category(): string {
    return this.transactionsForm.get<string>('category')?.value;
  };

  newCategory(): string {
    return this.transactionsForm.get<string>('newCategory')?.value;
  }

  constructor(private transactionService: TransactionService, private authService: AuthService) {}

  ngOnInit() {
    this.getUserId();
    this.getAllCategories();
  };

  getAllCategories() {
    this.transactionService.getAllCategory().subscribe({
      next: (categories) => {
        this.categoryList.set(categories);
        // console.log('Categorias SIG', this.categoryList())
      },
      error: err => {
        console.error(err)
      }
    });
  }

  createCategory(payload: any) {
    this.transactionService.createCategory(payload).subscribe({
      next: (category) => {
        this.categoryId = category;
        this.getAllCategories();
        return category;
      }
    })
  }


  getUserId() {
    this.authService.getDataUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }

  createTransaction () {
    let isCategory: string = this.category();

    if(this.category() === 'Outra') {
      isCategory = this.newCategory();
      this.createCategory({name: isCategory, user: this.user._id});

      console.log('Categoria', this.categoryId)
      isCategory = this.categoryId._id;
    };
    console.log('CategoryId: ' + isCategory + '\n UserId ' + this.user._id);   
    
    console.log('Formulário de transação',this.transactionsForm.value);
  }
}
