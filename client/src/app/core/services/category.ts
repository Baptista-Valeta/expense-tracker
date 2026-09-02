import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { Categories, AllCategories, CategoryStatistics } from '../../core/models/category';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = inject(AuthService).apiUrl;
  categories = signal<AllCategories['categories']|null>(null);

  constructor(private http: HttpClient) {};

  createCategory(payload: any) {
    return this.http.post<Categories>(this.apiUrl+'categories', payload).pipe(
      map(category => {
        console.log('Create Category', category.categories);
        return category.categories;
      }),
      catchError(error => {
        if(error.status === 400) {
          console.error('Erro ao criar categoria', error);
          return throwError(() => 'Campo Inválido');
        };
        return throwError(() => error.message);
      })
    );
  };

  getAllCategory() {
    return this.http.get<AllCategories>(this.apiUrl+'categories').pipe(
      map(categories => {
        console.log('Todas as categorias', categories.categories);
        return categories.categories;
      }),
      catchError(error => {
        if(error.status === 404) {
          return throwError(() => 'Nenhuma categoria encontrada');
        };
        console.error('Erro ao buscar categoria:', error)
        return throwError(() => error);
      })
    );
  };

  getCategoryStatistics() {
    return this.http.get<CategoryStatistics>(this.apiUrl+'categories/statistics').pipe(
      map(categories => {
        console.log('[Statistics]', categories);
        return categories.categories;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  };

  updateCategory(payload: Categories['categories']) {
    return this.http.put<Categories['categories']>(this.apiUrl+'categories/'+payload._id, payload).pipe(
      map(category => {
        console.log('[PUT] /categories/:id Categoria atualizada', category)
      }),
      catchError(error => {
        let message;
        switch(error.status) {
          case 400:
            message = 'Informe o campo nome';
            break;
          case 404:
            message = 'Categoria não encontrada';
            break
        };
        console.error(message, error);
        return throwError(() => error);
      })
    );
  };

  deleteCategory(id: string) {
    return this.http.delete(this.apiUrl+'categories/'+id).pipe(
      map(res => {
        console.log('[DELETE CATEGORY]',res);
      }),
      catchError((error) => {
        if(error.status === 400) {
          return throwError(() => error.error);          
        }
        return throwError(() => error);
      })
    )
  }
}
