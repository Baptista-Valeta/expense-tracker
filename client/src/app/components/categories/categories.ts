import { Component } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CategoryService } from '../../core/services/category';
import { Categories } from '../../core/models/category';

@Component({
  selector: 'app-categories',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent {
  payload: any;

  name: FormControl = new FormControl('', [
    Validators.minLength(2),
    Validators.required
  ]);
  
  constructor(protected categoryService: CategoryService, private toast: ToastrService) {};

  ngOnInit () {
    this.categoryService.getAllCategory().subscribe(categories => {
      this.categoryService.categories.set(categories);
    });
  };

  deleteCategories(id: string, name: string) {
    const confirmRemove = confirm(`Deseja excluir a categoria ${name}`);
    if(confirmRemove == true) {
      this.categoryService.deleteCategory(id).subscribe({
        next: res => {
          this.toast.info('Categoria Removida');
          // Atualiza a lista de categorias
          this.categoryService.getAllCategory().subscribe(categories => {
            this.categoryService.categories.set(categories);
          });
          console.log(res);
        },
        error: error => {
          if(!error.status) {
            this.toast.info(error);
          }
        }
      });
    };
  };

  updateCategory(event: Event, payload: Categories['categories']) {
    event.preventDefault(); // Para evitar o carregamento da página

    this.name.markAsDirty();
    this.name.markAllAsTouched();
    if(!this.name.invalid) {
      payload.name = this.name.value;
      this.categoryService.updateCategory(payload).subscribe({
        next: category => {
          this.toast.success('Categoria atualizada');
          // Atualizar a lista de categorias
          this.categoryService.getAllCategory().subscribe(categories => {
            this.categoryService.categories.set(categories);
          });
        },
        error: error => {
          this.toast.error('Ocorreu um erro ao atualizar');
        }
      });

      this.closeForm();
    };
  };
  
  showForm(category: Categories['categories']) {
    this.payload = category;
    this.name.setValue(category.name);

    const formCategory = document.getElementById('formCategory')!;
    formCategory.style.display = 'block';
  };

  closeForm(event?: Event) {
    event?.preventDefault();
    const formCategory = document.getElementById('formCategory')!;
    formCategory.style.display = 'none';
  };

};
