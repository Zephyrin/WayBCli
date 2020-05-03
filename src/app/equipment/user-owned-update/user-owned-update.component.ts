import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';

import { ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { FormControl, FormArray } from '@angular/forms';
import { HaveService } from '@app/_services/have.service';
import { Have, Equipment, User, Characteristic } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-user-owned-update',
  templateUrl: './user-owned-update.component.html',
  styleUrls: ['./user-owned-update.component.less']
})
export class UserOwnedUpdateComponent implements OnInit, OnChanges {
  @Input() equipment: Equipment;
  @ViewChild('modal', { static: true }) modal;

  havesForm: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: HaveService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.equipment) {
      this.open();
    }
  }

  ngOnInit() {
    this.loading = true;
    this.isCreateForm = true;
    this.havesForm = this.formBuilder.group({
      haves: this.formBuilder.array([])
    });
    /*     this.haves.push(this.formBuilder.group({
          characteristic: new FormControl(''),
          ownQuantity: new FormControl(0),
          wantQuantity: new FormControl(0)
        })); */
    this.loading = false;
  }

  get haves() { return this.havesForm.get('haves') as FormArray; }

  open() {
    this.selected = null;
    let hasEmptyCharacteristic = false;
    if (!this.havesForm) {
      return;
    }
    this.clearFormArray(this.haves);
    this.currentUser.haves.forEach(have => {
      if (have.equipment.id === this.equipment.id) {
        if (have.characteristic === null || have.characteristic === undefined) {
          hasEmptyCharacteristic = true;
        }
        this.push(have, have.characteristic);
      }
    });
    this.equipment.characteristics.forEach(characteristic => {
      if (!this.currentUser.haves.some(
        have => (have.characteristic?.id || -1) === characteristic.id)) {
        this.push(new Have(), null);
      }
    });
    if (!hasEmptyCharacteristic) {
      this.push(new Have(), null);
    }
    $(this.modal.nativeElement).modal();
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  push(have: Have, characteristic: Characteristic) {
    this.haves.push(this.formBuilder.group({
      id: new FormControl(have.id),
      characteristic: new FormControl(new Characteristic(characteristic)),
      ownQuantity: new FormControl(have.ownQuantity),
      wantQuantity: new FormControl(have.wantQuantity)
    }));
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  hasError(name) {
    return this.submitted
      && this.errors.hasErrors[name];
  }

  onCancel() {
    this.submitted = false;
    this.errors = new FormErrors();
    this.equipment = null;
  }

  onSubmit() {
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.havesForm.invalid) {
      return;
    }
    this.loading = true;
    const values = this.havesForm.value;
    values.haves.forEach(tmp => {
      const have = new Have();
      have.equipment = this.equipment;
      have.characteristic = tmp.characteristic;
      have.wantQuantity = tmp.wantQuantity;
      have.ownQuantity = tmp.ownQuantity;
      have.id = tmp.id;
      if (have.id === 0 && (have.ownQuantity > 0 || have.wantQuantity > 0)) {
        this.service.create(this.currentUser.id, have);
      } else if (have.id > 0) {
        if (have.ownQuantity === 0 && have.wantQuantity === 0) {
          this.service.delete(this.currentUser.id, have);
        } else {
          this.service.update(this.currentUser.id, have);
        }
      }
    });
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
