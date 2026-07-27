import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { TransactionService } from '../../core/services/transaction';
import { DatePipe, JsonPipe } from '@angular/common';
import { FormTransactions } from './form-transactions/form-transactions';

@Component({
  selector: 'app-transactions',
  imports: [ DatePipe, FormTransactions ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  transactions = signal<any>(null);
  constructor(private transactionService: TransactionService) {}
  
  
  ngOnInit() {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        console.log(transactions)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
