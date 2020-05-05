import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';

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
  selector: 'app-characteristic-update',
  templateUrl: './characteristic-update.component.html',
  styleUrls: ['./characteristic-update.component.less']
})
export class CharacteristicUpdateComponent implements OnInit {
  @Input() parentData: Equipment;

  @Output() updateDone = new EventEmitter<SimpleChange>();

  @ViewChild('modal', { static: true }) modal;
  @ViewChild('selectGender', { static: true }) selectGender;
  @ViewChild('deleteModal', { static: true }) deleteModal;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;

  deleteError: string = undefined;
  deleteHasError = false;

  selected: Characteristic;

  genderKeys: any[] = [];

  simpleChange: SimpleChange;

  get f() { return this.form.controls; }

  get isCreateFormUndefined() { return this.isCreateForm === undefined; }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CharacteristicService,
    private authenticationService: AuthenticationService
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
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

  compareByID(itemOne, itemTwo) {
    if (itemOne === null && itemTwo === null) {
      return true;
    }
    return itemOne && itemTwo && itemOne.id === itemTwo.id;
  }

  update(data: Characteristic) {
    this.loading = false;
    this.simpleChange = new SimpleChange(data, null, true);
    this.form.reset(new Characteristic());
    this.form.patchValue(this.simpleChange.previousValue);
    this.isCreateForm = false;
    $(this.modal.nativeElement).modal();
  }

  create() {
    this.loading = false;
    this.form.reset(new Characteristic());
    this.simpleChange = new SimpleChange(null, null, true);
    this.isCreateForm = true;
    $(this.modal.nativeElement).modal();
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
        this.simpleChange.currentValue = this.form.value;
        this.endTransaction();
        //this.parentData.characteristics.push(this.form.value);
      } else {
        this.service.create(this.parentData.id
          , this.form.value)
          .subscribe(characteristic => {
            this.simpleChange.currentValue = characteristic;
            this.endTransaction();
            //this.parentData.characteristics.push(characteristic);
          }, (error: any) => {
            this.endTransactionError(error);
          });
      }
    } else {
      if (this.parentData === undefined || this.parentData.id === 0) {
        this.simpleChange.currentValue = new Characteristic(this.form.value);
        this.endTransaction();
      } else {
        this.service.update(this.parentData.id, this.form.value)
          .subscribe(returnValue => {
            this.simpleChange.currentValue = new Characteristic(this.form.value);
            this.endTransaction();
          }, (error: any) => {
            this.endTransactionError(error);
          });
      }
    }
  }

  delete(characteristic: Characteristic) {
    this.selected = characteristic;
    this.deleteModal.open();
  }

  deleteResp($event: boolean) {
    if ($event) {
      this.loading = true;
      this.simpleChange = new SimpleChange(this.selected, null, true);
      this.service.delete(this.parentData.id
        , this.simpleChange.previousValue)
        .subscribe(
          next => {
            this._delete(this.simpleChange.previousValue);
            this.endTransaction();
          }, error => {
            if (error.status === 404) {
              this._delete(this.simpleChange.previousValue);
              this.endTransaction();
            } else {
              this.manageDeleteError(error.message);
            }
          });
    }
  }

  _delete(deleteValue: Characteristic) {
    this.manageDeleteError(undefined);
    /* const index = this.parentData.characteristics.indexOf(deleteValue);
    this.parentData.characteristics.splice(index, 1); */
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
    this.updateDone.emit(this.simpleChange);
    this.deleteModal.close();
    $(this.modal.nativeElement).modal('hide');
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }
}
