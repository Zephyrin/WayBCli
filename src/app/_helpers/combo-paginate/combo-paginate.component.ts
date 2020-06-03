import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';

import { FilterEnum } from '@app/_enums/filter.enum.ts';
declare var $: any;

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
  @ViewChild('combo', { static: false }) combo;

  @Input() paginate: PaginationAndParamsService<T>;
  @Input() emptyText = 'Select...';
  @Input() comboId = '';
  @Input() filterEnum = FilterEnum.none;

  public disabled = false;
  public value: T;

  constructor() { }

  catchKeyDown(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      if ($(this.combo.nativeElement).attr('aria-expanded') === 'true') {
        $(this.combo.nativeElement).dropdown('toggle');
        event.stopPropagation();
      }
    }
  }
  get selectedOrEmptyText() {
    return this.value ? this.paginate.displayName(this.value) : this.emptyText;
  }

  get FilterType() { return FilterEnum; }

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
