import { Component, OnInit, Input, EventEmitter, Output, SimpleChange } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubCategoryService } from '@app/_services/sub-category.service';
import { SubCategory, Category } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-sub-category-update',
  templateUrl: './sub-category-update.component.html',
  styleUrls: ['./sub-category-update.component.scss']
})
export class SubCategoryUpdateComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('deleteModal', { static: true }) deleteModal;
  @Input() parent: Category;
  @Output() updateDone = new EventEmitter<SimpleChange>();

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  simpleChange: SimpleChange;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: SubCategoryService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
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

  open(value: SubCategory = null) {
    this.loading = false;
    this.submitted = false;
    if (value === null) {
      this.create();
    } else {
      this.update(value);
    }
    $(this.modal.nativeElement).modal();
  }

  isSubmittedAndHasError(name: string) {
    return this.submitted && this.form
      && (this.form.controls[name].errors || this.errors.hasErrors[name]);
  }

  setSelected(selected: SubCategory) {
    if (!this.loading) {
      if (selected === this.selected) {
        this.selected = undefined;
      } else {
        this.selected = selected;
      }
    }
  }

  update(value: SubCategory) {
    this.selected = value;
    this.simpleChange = new SimpleChange(value, value, true);
    this.form.reset(new SubCategory());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.form.reset(new SubCategory());
    this.selected = new SubCategory();
    this.simpleChange = new SimpleChange(null, this.selected, true);
    this.form.patchValue(this.selected);
    this.isCreateForm = true;
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  onCancel() {
    this.errors = new FormErrors();
    if (this.selected.id === undefined || this.selected.id === 0) {
      this.selected = null;
    }
  }

  onSubmit() {
    this.endTransactionError(undefined);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateForm) {
      this.service.create(this.parent.id, this.form.value)
        .subscribe(subCategory => {
          this.simpleChange.currentValue = new SubCategory(subCategory);
          this.endTransaction();
        }, (error: any) => {
          this.endTransactionError(error);
        });
    } else {
      this.service.update(this.parent.id, this.form.value)
        .subscribe(returnValue => {
          this.endTransaction();
          this.simpleChange.currentValue = new SubCategory(this.form.value);
        }, (error: any) => {
          this.endTransactionError(error);
        });
    }
  }

  onDelete(deleteValue: SubCategory) {
    this.endTransactionError(undefined);
    this.selected = deleteValue;
    this.simpleChange = new SimpleChange(deleteValue, null, true);
    this.deleteModal.open();
  }

  delete($event: boolean) {
    if ($event) {
      this.loading = true;
      this.endTransactionError(undefined);
      this.service.delete(this.parent.id, this.selected).subscribe(next => {
        this._delete();
        this.endTransaction();
      }, error => {
        if (error.status === 404) {
          this._delete();
          this.endTransaction();
        } else {
          this.endTransactionError(error);
        }
      });
    }
  }

  _delete() {
    this.endTransactionError(undefined);
    this.loading = false;
    this.selected = null;
  }

  endTransaction() {
    this.loading = false;
    this.deleteModal.close();
    $(this.modal.nativeElement).modal('hide');
    this.updateDone.emit(this.simpleChange);
  }

  endTransactionError(error) {
    this.loading = false;
    if (error) {
    this.errors.formatError(error);
    } else {
      this.errors = new FormErrors();
    }
  }
}
