import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CategoryService } from '@app/_services/category.service';
import { SubCategoryService } from '@app/_services/sub-category.service';
import { Category, SubCategory } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router, ChildActivationStart } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.less']
})
export class CategoryComponent implements OnInit {
  @ViewChild('createModal', {static: true}) createModal;
  @ViewChild('updateModal', {static: true}) updateModal;
  @ViewChild('createModalChild', {static: true}) createModalChild;
  @ViewChild('updateModalChild', {static: true}) updateModalChild;

  createForm: FormGroup;
  updateForm: FormGroup;
  createFormChild: FormGroup;
  updateFormChild: FormGroup;
  updateValue: Category;
  selectedChild: SubCategory;
  errors = new FormErrors();
  deleteError = '';
  deleteHasError = false;
  categories: Category[];
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CategoryService,
    private childService: SubCategoryService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
    }

  update(updateValue: Category) {
    this.updateForm.patchValue(updateValue);
    this.updateValue = updateValue;
  }

  create() {
    this.createForm.reset();
  }

  createChild(category: Category) {
    this.updateValue = category;
    this.createFormChild.reset();
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
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.updateForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      subCategories: ['']
    });
    this.createFormChild = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.updateFormChild = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  get fC() { return this.createForm.controls; }
  get fU() { return this.updateForm.controls; }
  get fCC() { return this.createFormChild.controls; }
  get fUC() { return this.updateFormChild.controls; }

  onSubmitCreate() {
    this.deleteHasError = false;
    this.errors = new FormErrors();
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.loading = true;
    this.service.create(this.createForm.value)
      .subscribe(category => {
        this.loading = false;
        this.submitted = false;
        $(this.createModal.nativeElement).modal('hide');
        this.categories.push(category);
    }, (error: any) => {
      this.errors.formatError(error);
      this.loading = false;
    });
  }

  onSubmitUpdate(category: Category) {
    this.deleteHasError = false;
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.updateForm.invalid) {
      return;
    }
    this.loading = true;
    this.service.update(this.updateForm.value)
      .subscribe(returnValue => {
        this.loading = false;
        this.submitted = false;
        $(this.updateModal.nativeElement).modal('hide');
        Object.assign(this.updateValue, this.updateForm.value);
        this.updateValue = null;
      }, (error: any) => {
        this.errors.formatError(error);
        this.loading = false;
      });
  }

  onCancel() {
    this.errors = new FormErrors();
    this.updateValue = null;
  }

  delete(deleteValue: Category) {
    const index = this.categories.indexOf(deleteValue);
    this.categories.splice(index, 1);
    this.loading = false;
  }

  onDelete(deleteValue: Category) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.service.delete(deleteValue).subscribe(next => {
      this.delete(deleteValue);
    }, error => {
      if (error.status === 404) {
        this.delete(deleteValue);
      } else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }

  clearError(key) {
    this.errors.clearError(key);
  }



  onSubmitCreateChild() {
    this.deleteHasError = false;
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.createFormChild.invalid) {
      return;
    }
    this.loading = true;
    this.childService.create(this.updateValue.id, this.createFormChild.value)
      .subscribe(subCategory => {
        this.loading = false;
        this.submitted = false;
        $(this.createModalChild .nativeElement).modal('hide');
        this.updateValue.subCategories.push(subCategory);
    }, (error: any) => {
      this.errors.formatError(error);
    });
  }

  setSelectedChild(parent: Category, child: SubCategory) {
    this.updateValue = parent;
    this.selectedChild = child;
  }

  updateChild() {
    this.updateFormChild.patchValue(this.selectedChild);
  }

  onSubmitUpdateChild() {
    this.deleteHasError = false;
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.updateFormChild.invalid) {
      return;
    }
    this.loading = true;
    this.childService.update(this.updateValue.id, this.updateFormChild.value)
      .subscribe(returnValue => {
        this.loading = false;
        this.submitted = false;
        $(this.updateModalChild.nativeElement).modal('hide');
        Object.assign(this.selectedChild, this.updateFormChild.value);
        this.updateValue = null;
        this.selectedChild = null;
      }, (error: any) => {
        this.errors.formatError(error);
      });
  }

  deleteChild(deleteValue: SubCategory) {
    const index = this.updateValue.subCategories.indexOf(deleteValue);
    this.updateValue.subCategories.splice(index, 1);
    this.loading = false;
  }

  onDeleteChild() {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.childService.delete(this.updateValue.id,
         this.selectedChild).subscribe(next => {
      this.deleteChild(this.selectedChild);
    }, error => {
      if (error.status === 404) {
        this.deleteChild(this.selectedChild);
      } else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }
}
