import { Component, OnInit, Input } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraFieldDefService } from '@app/_services/extra-field-def.service';
import { ExtraFieldDef, Category, SubCategory } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { EnumType } from '@app/_enums';

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
  @ViewChild('selectType', {static: true}) selectType;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected: ExtraFieldDef = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  typeKeys: any[] = [];

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
    Object.keys(EnumType).filter(Number).forEach(key => {
      this.typeKeys.push({
        key: EnumType[key].toUpperCase(),
        display: EnumType[key]
      });
    });
    this.isCreateForm = undefined;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      isPrice: [false, Validators.required],
      isWeight: [false, Validators.required],
      linkTo: [null]
    });

    this.loading = false;
  }

  setSelected(selected: ExtraFieldDef) {
    if (selected === this.selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
      this.form.reset(new ExtraFieldDef());
      this.form.patchValue(this.selected);
    }
  }

  update() {
    this.form.reset(new ExtraFieldDef());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.form.reset(new ExtraFieldDef());
    this.selected = undefined;
    this.isCreateForm = true;
  }

  filter(array: ExtraFieldDef[]): ExtraFieldDef[] {
    let result: ExtraFieldDef[] = [];
    if (array !== undefined && array !== null) {
      array.forEach(value => {
        if (this.selected === undefined || value.id !== this.selected.id) {
          result.push(value);
        }
      });
    }
    return result;
  }

  compareByID(itemOne, itemTwo) {
    if (itemOne === null && itemTwo === null) {
      return true;
    }
    return itemOne && itemTwo && itemOne.id === itemTwo.id;
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
      if (this.subCategory === undefined
          || this.subCategory.id === undefined
          || this.subCategory.id === 0) {
        this.endTransaction();
        this.extraFieldDefs.push(this.form.value);
      } else {
        const linkTo = this.form.value.linkTo;
        if (linkTo !== undefined && linkTo !== null && linkTo.id !== undefined) {
          this.form.value.linkTo = linkTo.id;
        }
        this.service.create(this.category.id
                            , this.subCategory.id
                            , this.form.value)
          .subscribe(extraFieldDef => {
            this.form.value.linkTo = linkTo;
            this.endTransaction();
            this.extraFieldDefs.push(extraFieldDef);
        }, (error: any) => {
          this.form.value.linkTo = linkTo;
          this.endTransactionError(error);
        });
      }
    } else {
      if (this.subCategory === undefined || this.subCategory.id === 0) {
        this.endTransaction();
        Object.assign(this.selected, this.form.value);
      } else {
        const linkTo = this.form.value.linkTo;
        if (linkTo !== undefined && linkTo !== null && linkTo.id !== undefined) {
          this.form.value.linkTo = linkTo.id;
        }
        this.service.update(this.category.id, this.subCategory.id, this.form.value)
        .subscribe(returnValue => {
          this.endTransaction();
          this.form.value.linkTo = linkTo;
          Object.assign(this.selected, this.form.value);
        }, (error: any) => {
          this.form.value.linkTo = linkTo;
          this.endTransactionError(error);
        });
      }
    }
  }

  onDelete() {
    this.loading = true;
    this.service.delete(this.category.id,
                        this.subCategory.id,
                        this.selected)
                        .subscribe(
                          next => {
      this.extraFieldDefs.forEach(extra => {
        if (extra.linkTo && extra.linkTo.id === this.selected.id) {
          extra.linkTo = null;
        }
      });
      this.delete(this.selected);
      this.endTransaction();
      this.selected = null;
    }, error => {
      if (error.status === 404) {
        this.delete(this.selected);
      } else {
        this.manageDeleteError(error.message);
      }
      this.endTransaction();
      this.selected = null;
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
    $(this.modal.nativeElement).collapse('hide');
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }
}
