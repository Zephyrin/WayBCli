import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectorRef } from '@angular/core';

import { Characteristic, Equipment } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { CharacteristicService } from '@app/_services/characteristic.service';

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.scss']
})
export class CharacteristicComponent implements OnInit {
  @Input() parentData: Equipment;
  @Input() set updateData(simple: SimpleChange) {
    this.$updateData = simple;
    // To update the view in a correct manner:
    // Fix error ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.parentData.characteristics.push(simple.currentValue);
        } else if (simple.currentValue === null) {
          const index = this.parentData.characteristics.indexOf(simple.previousValue);
          if (index > 0) {
            this.parentData.characteristics.splice(index, 1);
          }
        } else {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        this.cd.detectChanges();
      }
    });
  }
  get updateData() { return this.$updateData; }

  @Output() create = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<Characteristic>();
  @Output() delete = new EventEmitter<Characteristic>();

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

  onCreate() {
    this.create.emit(true);
  }

  onUpdate(characteristic: Characteristic) {
    this.update.emit(characteristic);
  }

  onDelete(characteristic: Characteristic) {
    this.delete.emit(characteristic);
  }

  updateAskValidate(characteristic: Characteristic) {
    this.errors = new FormErrors();
    this.setSelected(characteristic);
    this.loading = true;
    characteristic.askValidate = !characteristic.askValidate;
    this.service.update(this.parentData.id, characteristic)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        characteristic.askValidate = !characteristic.askValidate;
        this.loading = false;
      });
  }
}
