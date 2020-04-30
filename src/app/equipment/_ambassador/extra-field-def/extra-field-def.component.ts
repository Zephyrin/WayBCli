import { Component, OnInit, Input } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraFieldDefService } from '@app/_services/extra-field-def.service';
import { ExtraFieldDef, Category, SubCategory } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-extra-field-def',
  templateUrl: './extra-field-def.component.html',
  styleUrls: ['./extra-field-def.component.less']
})
export class ExtraFieldDefComponent implements OnInit {
  @Input('category') category;
  @Input('subCategory') subCategory;
  @Input('extraFieldDefs') extraFieldDefs;

  @ViewChild('modal', {static: true}) modal;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected: ExtraFieldDef = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: ExtraFieldDefService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
  }

  get f() { return this.form.controls; }

  get isCreateFormUndefined() { return this.isCreateForm === undefined; }

  ngOnInit() {
    this.loading = true;
    this.isCreateForm = undefined;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      isPrice: ['', Validators.required],
      isWeight: ['', Validators.required],
      linkTo: ['']
    });

    this.loading = false;
  }

  setSelected(selected: ExtraFieldDef) {
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
    this.isCreateForm = undefined;
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
      this.service.create(this.category.id, this.subCategory.id, this.form.value)
        .subscribe(extraFieldDef => {
          this.endTransaction();
          this.extraFieldDefs.push(extraFieldDef);
      }, (error: any) => {
        this.endTransactionError(error);
      });
    } else {
      this.service.update(this.category.id, this.subCategory.id, this.form.value)
      .subscribe(returnValue => {
        this.endTransaction();
        console.log(returnValue);
        Object.assign(this.selected, this.form.value);
      }, (error: any) => {
        this.endTransactionError(error);
      });
    }
  }

  onDelete() {
    this.loading = true;
    this.service.delete(this.category.id,
                        this.subCategory.id,
                        this.selected)
                        .subscribe(
                          next => {
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

  delete(deleteValue: ExtraFieldDef) {
    this.manageDeleteError(undefined);
    const index = this.extraFieldDefs.indexOf(deleteValue);
    this.extraFieldDefs.splice(index, 1);
    this.loading = false;
  }

  manageDeleteError(message: string) {
    this.deleteError = message;
    this.deleteHasError = message !== undefined;
  }

  endTransaction() {
    this.loading = false;
    this.submitted = false;
    this.isCreateForm = undefined;
    $(this.modal.nativeElement).hide();
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }

}
