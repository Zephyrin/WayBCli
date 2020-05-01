import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CategoryService } from '@app/_services/category.service';
import { Category } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.less']
})
export class CategoryComponent implements OnInit {
  @ViewChild('modal', {static: true}) modal;

  categories: Category[];
  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CategoryService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
    }

  get f() { return this.form.controls; }

  collapse(category: Category) {
    if ($('#categoryCardCollapse_' + category.id).hasClass('show')) {
      $('#categoryCardCollapse_' + category.id).collapse('hide');
    } else {
      $('#categoryCardCollapse_' + category.id).collapse('show');
    }
  }

  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.service.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.loading = false;
        this.categories = categories;
    });

    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      subCategories: ['']
    });
  }

  update(updateValue: Category) {
    this.form.patchValue(updateValue);
    this.selected = updateValue;
    this.isCreateForm = false;
  }

  create() {
    this.form.reset();
    this.isCreateForm = true;
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  onSubmitCreate() {
    this.manageDeleteError(undefined);
    this.errors = new FormErrors();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateForm) {
      this.service.create(this.form.value)
        .subscribe(category => {
          this.endTransaction();
          this.categories.push(category);
      }, (error: any) => {
        this.endTransactionError(error);
      });
    } else {
      this.service.update(this.form.value)
        .subscribe(returnValue => {
          this.endTransaction();
          Object.assign(this.selected, this.form.value);
        }, (error: any) => {
          this.endTransactionError(error);
        });
    }
  }

  onCancel() {
    this.errors = new FormErrors();
  }

  delete(deleteValue: Category) {
    const index = this.categories.indexOf(deleteValue);
    this.categories.splice(index, 1);
    this.loading = false;
    this.manageDeleteError(undefined);
  }

  onDelete(deleteValue: Category) {
    this.loading = true;
    this.manageDeleteError(undefined);
    this.service.delete(deleteValue).subscribe(next => {
      this.delete(deleteValue);
      this.endTransaction();
    }, error => {
      if (error.status === 404) {
        this.delete(deleteValue);
      } else {
        this.manageDeleteError(error.message);
      }
      this.endTransaction();
    });
  }

  manageDeleteError(message: string) {
    this.deleteError = message;
    this.deleteHasError = message !== undefined;
  }

  endTransaction() {
    this.loading = false;
    this.submitted = false;
    $(this.modal.nativeElement).modal('hide');
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }
}
