import { Component, OnInit, Input } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacteristicService } from '@app/_services/characteristic.service';
import { Characteristic, Equipment } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { EnumGender } from '@app/_enums';

declare var $: any;

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.less']
})
export class CharacteristicComponent implements OnInit {
  @Input() parentData;

  @ViewChild('modal', {static: true}) modal;
  @ViewChild('selectGender', {static: true}) selectGender;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected: Characteristic = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  genderKeys: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CharacteristicService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/login']);
      }
  }

  get f() { return this.form.controls; }

  get isCreateFormUndefined() { return this.isCreateForm === undefined; }

  ngOnInit() {
    this.loading = true;
    Object.keys(EnumGender).filter(Number).forEach(key => {
      this.genderKeys.push({
        key: EnumGender[key].toUpperCase(),
        display: EnumGender[key]
      });
    });
    this.isCreateForm = undefined;
    this.form = this.formBuilder.group({
      id: [''],
      size: ['', Validators.required],
      gender: [EnumGender.Unisex, Validators.required],
      price: [0, Validators.required],
      weight: [0, Validators.required],
    });

    this.loading = false;
  }

  setSelected(selected: Characteristic) {
    if (selected === this.selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
      this.form.reset(new Characteristic());
      this.form.patchValue(this.selected);
    }
  }

  update() {
    this.form.reset(new Characteristic());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.form.reset(new Characteristic());
    this.selected = undefined;
    this.isCreateForm = true;
  }

  filter(array: Characteristic[]): Characteristic[] {
    const result: Characteristic[] = [];
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
      if (this.parentData === undefined
          || this.parentData.id === undefined
          || this.parentData.id === 0) {
        this.endTransaction();
        this.parentData.characteristics.push(this.form.value);
      } else {
        this.service.create(this.parentData.id
                            , this.form.value)
          .subscribe(characteristic => {
            this.endTransaction();
            this.parentData.characteristics.push(characteristic);
        }, (error: any) => {
          this.endTransactionError(error);
        });
      }
    } else {
      if (this.parentData === undefined || this.parentData.id === 0) {
        this.endTransaction();
        Object.assign(this.selected, this.form.value);
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
  }

  onDelete() {
    this.loading = true;
    this.service.delete(this.parentData.id
                        , this.selected)
                        .subscribe(
                          next => {
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

  delete(deleteValue: Characteristic) {
    this.manageDeleteError(undefined);
    const index = this.parentData.characteristics.indexOf(deleteValue);
    this.parentData.characteristics.splice(index, 1);
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
