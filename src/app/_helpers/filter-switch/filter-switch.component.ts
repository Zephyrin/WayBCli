import {
  Component,
  Input,
  forwardRef
} from '@angular/core';
import { ViewChild, EventEmitter, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BooleanEnum } from '@app/_enums/boolean.enum';

@Component({
  selector: 'app-filter-switch',
  templateUrl: './filter-switch.component.html',
  styleUrls: ['./filter-switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSwitchComponent),
      multi: true,
    },
  ],
})
export class FilterSwitchComponent implements ControlValueAccessor {
  @ViewChild('cmp', { static: false }) cmp;

  @Output() check = new EventEmitter();

  @Input() disabled = false;

  @Input()
  set value(val) {
    this.valueP = val;
    this.onChange(val);
    this.onTouched();
  }
  get value() {
    return this.valueP;
  }
  valueP: any;

  @Input() text;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private render: Renderer2) {}

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

  clickCmp() {
    if (!this.disabled) {
      this.check.emit();
    }
  }

  get booleanEnum() {
    return BooleanEnum;
  }
}
