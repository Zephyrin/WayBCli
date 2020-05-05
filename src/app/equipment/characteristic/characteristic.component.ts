import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectorRef } from '@angular/core';

import { Characteristic, Equipment } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.less']
})
export class CharacteristicComponent implements OnInit {
  @Input() parentData: Equipment;
  @Input() set updateData(simple: SimpleChange) {
    this.$updateData = simple;
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

  private $updateData: SimpleChange;
  constructor(
    private router: Router,
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
      //this.form.reset(new Characteristic());
      //this.form.patchValue(this.selected);
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
}
