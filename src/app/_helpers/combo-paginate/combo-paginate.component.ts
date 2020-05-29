import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ViewChild, EventEmitter, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';

@Component({
  selector: 'app-combo-paginate',
  templateUrl: './combo-paginate.component.html',
  styleUrls: ['./combo-paginate.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboPaginateComponent),
      multi: true
    }
  ]
})
export class ComboPaginateComponent<T> implements ControlValueAccessor {
  @Input() paginate: PaginationAndParamsService;
  @Input() emptyText = 'Select...';

  public disabled = false;
  public value: T;

  constructor(private render: Renderer2) { }

  get selectedOrEmptyText() {
    return this.value ? this.paginate.displayName(this.value) : this.emptyText;
  }

  /**
   * Call when value has changed programmatically
   */
  public onChange(newVal: T) { }
  public onTouched(_?: any) { }

  /**
   * Model -> View changes
   */
  public writeValue(obj: T): void { this.value = obj; }
  public registerOnChange(fn: any): void { this.onChange = fn; }
  public registerOnTouched(fn: any): void { this.onTouched = fn; }
  public setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  /**
   * Helpers
   */
  prevent(event) {
    event.stopPropagation();
  }

  changeElt(elt: T) {
    this.value = elt;
    this.onChange(this.value);
    this.onTouched();
    return false;
  }
}
