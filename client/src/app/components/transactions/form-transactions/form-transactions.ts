import { Component } from '@angular/core';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-transactions',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-transactions.html',
  styleUrl: './form-transactions.css',
})
export class FormTransactions {
  test: any = 'eu'

  transactionsForm = new FormGroup({
    amount: new FormControl('', []),
    type: new FormControl('receita', []),
    category: new FormControl('', []),
    description: new FormControl('', []),
  });


  getTransactionsForm () {
    alert('Formário de transações')
    console.log('Formulário de transação',this.transactionsForm.value);
  }
}
