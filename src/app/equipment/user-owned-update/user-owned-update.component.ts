import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ViewChild } from '@angular/core';
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
  styleUrls: ['./user-owned-update.component.scss']
})
export class UserOwnedUpdateComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @Output() done = new EventEmitter<boolean>();

  havesForm: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  currentUser: User;
  equipment: Equipment;

  interval;

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

  ngOnInit() {
    this.loading = true;
    this.isCreateForm = true;
    this.havesForm = this.formBuilder.group({
      haves: this.formBuilder.array([])
    });
    this.loading = false;
  }

  get haves() { return this.havesForm.get('haves') as FormArray; }

  open(equipment: Equipment) {
    this.equipment = equipment;
    this.selected = null;
    let hasEmptyCharacteristic = false;
    if (!this.havesForm) {
      return;
    }
    this.errors = new FormErrors();
    this.clearFormArray(this.haves);
    // TODO order
    this.currentUser.haves.forEach(have => {
      if (have.equipment.id === this.equipment.id) {
        if (have.characteristic === null
          || have.characteristic === undefined) {
          hasEmptyCharacteristic = true;
        }
        this.push(have.id,
          have.wantQuantity,
          have.ownQuantity,
          have.characteristic);
      }
    });
    this.equipment.characteristics.forEach(characteristic => {
      if (!this.currentUser.haves.some(
        have => (have.characteristic?.id || -1) === characteristic.id)) {
        this.push(0, 0, 0, characteristic);
      }
    });
    if (!hasEmptyCharacteristic) {
      this.push(0, 0, 0, null);
    }
    $(this.modal.nativeElement).modal();
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  push(haveId: number,
       wantQuantity: number,
       ownQuantity: number,
       characteristic: Characteristic) {
    this.haves.push(this.formBuilder.group({
      id: new FormControl(haveId),
      characteristic: new FormControl(new Characteristic(characteristic)),
      ownQuantity: new FormControl(ownQuantity),
      wantQuantity: new FormControl(wantQuantity)
    }));
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  hasError(name, haveForm) {
    return this.submitted && haveForm
      && haveForm.controls[name].errors;
  }

  onCancel() {
    this.submitted = false;
    this.errors = new FormErrors();
    this.equipment = null;
  }

  plus(id, i, val = 1) {
    if (id === 'want_') {
      this.haves.controls[i].value.wantQuantity += val;
      $('#' + id + i).val(this.haves.controls[i].value.wantQuantity);
    } else {
      this.haves.controls[i].value.ownQuantity += val;
      $('#' + id + i).val(this.haves.controls[i].value.ownQuantity);
    }
  }

  minus(id, i, val = 1) {
    if (id === 'want_') {
      this.haves.controls[i].value.wantQuantity -= val;
      if (this.haves.controls[i].value.wantQuantity < 0) {
        this.haves.controls[i].value.wantQuantity = 0;
        this.doneTimer();
      }
      $('#' + id + i).val(this.haves.controls[i].value.wantQuantity);
    } else {
      this.haves.controls[i].value.ownQuantity -= val;
      if (this.haves.controls[i].value.ownQuantity < 0) {
        this.haves.controls[i].value.ownQuantity = 0;
        this.doneTimer();
      }
      $('#' + id + i).val(this.haves.controls[i].value.ownQuantity);
    }
  }

  sup0(id, i) {
    return $('#' + id + i).val() > 0;
  }



  doneTimer() {
    clearInterval(this.interval);
  }

  startTimer(id, i, op) {
    let plus = 10;
    let count = 0;
    this.interval = setInterval(() => {
      if (op === '+') {
        this.plus(id, i, plus);
      } else {
        this.minus(id, i, plus);
      }
      count++;
      if (count % 10 === 0) {
        plus += 100;
      }
    }, 500);
  }


  onSubmit() {
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.havesForm.invalid) {
      return;
    }
    let nbHave = 0;
    this.loading = true;
    const values = this.havesForm.value;
    let countRequest = 0;
    values.haves.forEach(tmp => {
      const have = new Have();
      have.equipment = this.equipment;
      if (tmp.characteristic.id === 0) {
        delete have.characteristic;
      } else {
        have.characteristic = tmp.characteristic;
      }
      have.wantQuantity = tmp.wantQuantity;
      have.ownQuantity = tmp.ownQuantity;
      have.id = tmp.id;
      if (have.id === 0 && (have.ownQuantity > 0 || have.wantQuantity > 0)) {
        countRequest++;
        nbHave++;
        this.service.create(this.currentUser.id, have)
          .subscribe(haveServer => {
            countRequest--;
            this.currentUser.haves.push(haveServer);
            this.endTransaction(countRequest, nbHave);
          }, error => {
            countRequest--;
            this.addError(error, countRequest);
          });
      } else if (have.id > 0) {
        countRequest++;
        if (have.ownQuantity === 0 && have.wantQuantity === 0) {
          nbHave--;
          this.service.delete(this.currentUser.id, have).subscribe(next => {
            countRequest--;

            this.delete(have);
            this.endTransaction(countRequest, nbHave);
          }, error => {
            countRequest--;
            if (error.status === 404) {
              this.delete(have);
              this.endTransaction(countRequest, nbHave);
            } else {
              this.addError(error, countRequest);
            }
          });
        } else {
          nbHave++;
          this.service.update(this.currentUser.id, have).subscribe(val => {
            countRequest--;
            this.currentUser.haves.forEach(look => {
              if (look.id === have.id) {
                look.ownQuantity = have.ownQuantity;
                look.wantQuantity = have.wantQuantity;
              }
            });
            this.endTransaction(countRequest, nbHave);
          }, error => {
            countRequest--;
            this.addError(error, countRequest);
          });
        }
      }
    });
  }

  addError(error, countRequest: number) {
    this.errors.formatError(error);
    if (countRequest === 0) {
      this.loading = false;
    }
  }

  delete(have: Have) {
    const index = this.currentUser.haves.indexOf(have);
    this.currentUser.haves.splice(index, 1);
  }

  endTransaction(countRequest: number, nbHave: number) {
    if (countRequest < 1) {
      this.loading = false;
      this.submitted = false;
      if (!this.errors.hasMessage) {
        this.equipment.has = nbHave > 0 ? true : false;
        this.equipment = null;
        this.done.emit(true);
        $(this.modal.nativeElement).modal('hide');
      }
    }
  }

  endTransactionError(error) {
    this.errors.formatError(error);
  }
}
