import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '@app/_services/brand.service';
import { Brand } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.less']
})
export class BrandUpdateComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('deleteModal', { static: true }) deleteModal;
  @Input() brands: Brand[];
  @Output() added = new EventEmitter<Brand>();

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
    private service: BrandService,
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
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      uri: ['', Validators.pattern(urlRegex)]
    });

    this.loading = false;
  }

  open(brand: Brand = null) {
    this.loading = false;
    this.submitted = false;
    if (brand === null) {
      this.create();
    } else {
      this.update(brand);
    }
    $(this.modal.nativeElement).modal();
  }

  isSubmittedAndHasError(name: string) {
    return this.submitted && this.form
      && (this.form.controls[name].errors || this.errors.hasErrors[name]);
  }

  setSelected(selected: Brand) {
    if (!this.loading) {
      if (selected === this.selected) {
        this.selected = undefined;
      } else {
        this.selected = selected;
      }
    }
  }

  update(brand: Brand) {
    this.selected = brand;
    this.form.reset(new Brand());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.form.reset(new Brand());
    this.selected = new Brand();
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
    this.errors = new FormErrors();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateForm) {
      this.service.create(this.form.value)
        .subscribe(brand => {
          this.endTransaction();
          this.brands.push(brand);
          this.added.emit(brand);
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

  onDelete(deleteValue: Brand) {
    this.selected = deleteValue;
    this.deleteModal.open();
  }

  delete($event: boolean) {
    if ($event) {
      this.loading = true;
      this.endTransactionError(undefined);
      this.service.delete(this.selected).subscribe(next => {
        this._delete(this.selected);
        this.endTransaction();
      }, error => {
        if (error.status === 404) {
          this._delete(this.selected);
          this.endTransaction();
        } else {
          this.endTransactionError(error);
        }
      });
    }
  }

  _delete(deleteValue: Brand) {
    this.endTransactionError(undefined);
    const index = this.brands.indexOf(deleteValue);
    this.brands.splice(index, 1);
    this.loading = false;
    this.selected = null;
  }

  endTransaction() {
    this.loading = false;
    this.deleteModal.close();
    $(this.modal.nativeElement).modal('hide');
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
