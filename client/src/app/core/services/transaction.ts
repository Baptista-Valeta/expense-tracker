import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import * as bootstrap from 'bootstrap';

import { AuthService } from './auth';
import { AllTransactions } from '../models/transactions';
import { AllCategories, Categories} from '../models/category';
import { Transaction} from '../models/transactions';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  apiUrl: string = inject(AuthService).apiUrl;
  transactions = signal<AllTransactions['transaction']|null>(null);
  
  constructor(private http: HttpClient) {};
  
  getTransactions() {
    return this.http.get<AllTransactions>(this.apiUrl+'transactions').pipe(
      map(transactions => {
        return transactions.transaction;
      }),
      catchError(error => {
        if(error.status === 404) {
          console.error('Nenhuma transação encontrada:', error);
          return throwError(() => "Nenhuma transação encontrada");
        }
        return throwError(() => error);
      })
    );
  };

  createTransaction(payload: Transaction['transaction']) {
    return this.http.post<Transaction>(this.apiUrl+'transactions', payload).pipe(
      map(transaction => {
        console.log('[Created]',transaction.transaction);
        return transaction.transaction;
      }),
      catchError(error => {
        if(error.status === 400) {
          console.error('[POST] Erro ao criar transação', error);
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  };

  updateTransaction(id: string, payload: Transaction['transaction']) {
    return this.http.put<any>(this.apiUrl+'transactions/'+id, payload).pipe(
      map(transaction => {
        console.log('[PUT]', transaction);
        return transaction.transaction;
      }),
      catchError(error => {
        console.error('Erro ao atualizar transações', error);
        if(error.status === 400) {
          let message;
          if (error.error === 'Saldo insuficiente') {
            message = 'Saldo Insuficiente';
          }else{
            message = 'Campo inválido';
          };
          return throwError(() => message);          
        }else if(error.status === 404) {
          return throwError(() => 'Transação não encontrada');
        };
        return throwError(() => error);
      })
    )
  };

  RemoveTransaction(id: string) {
    return this.http.delete<any>(this.apiUrl+'transactions/'+id).pipe(
      map(response => {
        console.log('[DELETE] /transactions', response);
        return response.message;
      }),
      catchError(error => {
        console.log('Erro ao excluir transação', error);
        return throwError(() => error);
      })
    );
  };

  closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop')!)!;
    modal.hide();
  };
};