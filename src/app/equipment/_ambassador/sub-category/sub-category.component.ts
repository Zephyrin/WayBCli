import { Component, OnInit, Input } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubCategoryService } from '@app/_services/sub-category.service';
import { SubCategory } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.less']
})
export class SubCategoryComponent implements OnInit {
  @Input() parentData;
  @Input('subCategories') subCategories;

  @ViewChild('modal', {static: true}) modal;

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
    private service: SubCategoryService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
  }

  get f() { return this.form.controls; }

  get invalid() { return this.submitted && this.f.message; }

  ngOnInit() {
    this.loading = true;
    this.isCreateForm = true;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required]
    });

    this.loading = false;
  }

  setSelected(selected: SubCategory) {
    if (selected === this.selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
    }
  }

  update() {
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.form.reset();
    this.isCreateForm = true;
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  onCancel() {
    this.errors = new FormErrors();
  }

  onSubmitModal() {
    this.manageDeleteError(undefined);
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateForm) {
      console.log(this.parentData.id);
      console.log(this.subCategories);
      this.service.create(this.parentData.id, this.form.value)
        .subscribe(subCategory => {
          this.endTransaction();
          this.subCategories.push(subCategory);
      }, (error: any) => {
        this.endTransactionError(error);
      });
    } else {
      this.service.update(this.parentData.id, this.form.value)
      .subscribe(returnValue => {
        this.endTransaction();
        Object.assign(this.selected, this.form.value);
      }, (error: any) => {
        this.endTransactionError(error);
      });
    }
  }

  onDelete() {
    this.loading = true;
    this.service.delete(this.selected.id,
         this.selected).subscribe(next => {
      this.delete(this.selected);
      this.endTransaction();
    }, error => {
      if (error.status === 404) {
        this.delete(this.selected);
      } else {
        this.manageDeleteError(error.message);
      }
      this.endTransaction();
    });
  }

  delete(deleteValue: SubCategory) {
    this.manageDeleteError(undefined);
    const index = this.subCategories.indexOf(deleteValue);
    this.subCategories.splice(index, 1);
    this.loading = false;
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
