import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectorRef } from '@angular/core';

import { Characteristic, Equipment } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { CharacteristicService } from '@app/_services/characteristic.service';

@Component({
  selector: 'app-characteristic-validator',
  templateUrl: './characteristic-validator.component.html',
  styleUrls: ['./characteristic-validator.component.scss']
})
export class CharacteristicValidatorComponent implements OnInit {
  @Input() parentData: Equipment;
  @Input() set updateData(simple: SimpleChange) {
    this.$updateData = simple;
    // To update the view in a correct manner:
    // Fix error ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.parentData.characteristics.push(simple.currentValue);
        } else if (simple.currentValue !== null) {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        this.cd.detectChanges();
      }
    });
  }
  get updateData() { return this.$updateData; }

  @Output() create = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<Characteristic>();

  selected: Characteristic = undefined;
  errors = new FormErrors();
  loading = false;
  private $updateData: SimpleChange;
  constructor(
    private router: Router,
    private service: CharacteristicService,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {

  }

  setSelected(selected: Characteristic) {
    if (selected === this.selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
    }
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

  onUpdate(characteristic: Characteristic) {
    this.update.emit(characteristic);
  }

  canEdit(characteristic: Characteristic) {
    return characteristic.askValidate || characteristic.validate;
  }

  updateValidate(characteristic: Characteristic) {
    this.errors = new FormErrors();
    this.setSelected(characteristic);
    this.loading = true;
    characteristic.validate = !characteristic.validate;
    this.service.update(this.parentData.id, characteristic)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        characteristic.validate = !characteristic.validate;
        this.loading = false;
      });
  }
}
