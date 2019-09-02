import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CategoryService } from '@app/_services/category.service';
import { Category } from '@app/_models/';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.less']
})
export class CategoryComponent implements OnInit {
  @ViewChild("updateCategory", {static:true}) updateCategory;

  categoryForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  deleteError = '';
  deleteHasError = false;
  categories: Category[];
  selectedCategory : Category;
  formError = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/'])
      }
     }
  
  setSelectedCategory(category : Category){
    if (category == this.selectedCategory){
      this.selectedCategory = null;
    }
    else
      this.selectedCategory = category;
  }

  get isSelectedCategory(){
    return this.selectedCategory == null;
  }

  editCategory(){
    this.categoryForm.patchValue(this.selectedCategory);
  }
  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.categoryService.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.loading = false;
        this.categories = categories;
    });
    this.categoryForm = this.formBuilder.group({
      id: ['', Validators.required],
      categoryname: ['', Validators.required],
      email: ['', Validators.required],
      enabled: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  get f() { return this.categoryForm.controls; }

  onSubmit() {
    this.deleteHasError = false;
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    this.loading = true;
    this.categoryService.update(this.categoryForm.value).subscribe(category =>{
      this.loading = false;
      this.submitted = false;
      this.formError = {};
      Object.assign(this.selectedCategory, this.categoryForm.value);
      $(this.updateCategory.nativeElement).modal('hide');
    }, (error: any) => {
      this.formError = {};
      // get the nested errors
      /* let errorData = error.json().errors.children; */
      let errorData = error.error.errors[0].children;
      // iterate the keys in errors
      for(let key in errorData) {
        // if key has nested "errors", get and set the error message, else set null
         errorData[key].errors ? this.formError[key] = errorData[key].errors : this.formError[key] = null;
      }
      this.error = error;
      this.loading = false;
    });
  }

  onCancel() {
    this.formError = {};
  }

  deleteCategory(category: Category) {
    var index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
    this.loading = false;
  }
  onDelete(category: Category) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.categoryService.delete(category).subscribe(next => {
      this.deleteCategory(category);
    },error => {
      if(error.status == 404) {
        this.deleteCategory(category);
      }
      else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }

  clearError(key) {
    this.formError[key] = null;
  }
}
