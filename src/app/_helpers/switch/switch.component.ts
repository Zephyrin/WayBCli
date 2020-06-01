import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ViewChild, EventEmitter, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * Usage :
 * <form [formGroup]="myForm" (ngSubmit)="submit()">
 *    <label for="switch-2">Reactive Forms</label>
 *    <app-switch id="switch-2" formControlName="mySwitch"></app-switch>
 *    <button>Submit</button>
 * </form>
 *
 * Taken from https://stackoverflow.com/questions/53949180/toggle-button-inside-angular-reactive-form
 *
 * With sample: https://stackblitz.com/edit/angular-szsw3k?file=src%2Fapp%2Fapp.component.html
 *
 * @export
 */
@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})

export class SwitchComponent implements ControlValueAccessor {
  @ViewChild('switchLabel', { static: false }) switchLabel;


  @HostBinding('attr.id')
  externalId = '';
  @Output() isChecked = new EventEmitter<boolean>();
  @Input()
  set id(value: string) {
    this._ID = value;
    this.externalId = null;
  }

  get id() {
    return this._ID;
  }

  @Input() disabled: boolean;

  private _ID = '';


  valueP = false;
  @Input('value') set value(val) {
    this.valueP = val;
    this.onChange(val);
    this.onTouched();
  }
  get value() {
    return this.valueP;
  }
  onChange: any = () => { };
  onTouched: any = () => { };


  constructor(private render: Renderer2) { }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  switch() {
    if (!this.disabled) {
      this.value = !this.value;
      this.isChecked.emit(this.value);
    }
  }
}
