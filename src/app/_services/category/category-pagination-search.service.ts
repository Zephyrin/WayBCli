import { BooleanEnum } from './../../_enums/boolean.enum';
import { isUndefined } from 'util';
import { Injectable, SimpleChange } from '@angular/core';
import { Params } from '@angular/router';
import { HttpParams, HttpResponse } from '@angular/common/http';

import { CategoryService } from './category.service';

import { Category } from '@app/_models';
import { SortByEnum } from '@app/_enums/category.enum';
import { ValidationAndSearchService } from '../helpers/validation-and-search.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryPaginationSearchService extends ValidationAndSearchService<Category> {

  /* Search */
  public lower: string = undefined;
  public lowerOrEq: string = undefined;
  public eq: string = undefined;
  public greater: string = undefined;
  public greaterOrEq: string = undefined;
  public noPagination = BooleanEnum.undefined;
  constructor(
    public service: CategoryService) {
    super(service);
  }

  getSortByEnum() {
    return SortByEnum;
  }

  getDefaultSortByEnum() {
    return SortByEnum.name;
  }

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);

    this.lower = this.lowerOrEq = this.eq = this.greater = this.greaterOrEq = undefined;
    if (params && params.hasOwnProperty('subCategoryCount')) {
      const $subCategoryCount = params.subCategoryCount;
      const $match = /(l|le|e|g|ge)(\d+)((l|le|e|g|ge)(\d+))?/.exec($subCategoryCount);
      for (let $i = 1; $i <= 3; $i = $i + 2) {
        if ($match[$i] !== undefined && $match[$i] !== undefined) {
          switch ($match[$i]) {
            case 'l':
              this.lower = $match[$i + 1];
              break;
            case 'le':
              this.lowerOrEq = $match[$i + 1];
              break;
            case 'e':
              this.eq = $match[$i + 1];
              break;
            case 'g':
              this.greater = $match[$i + 1];
              break;
            case 'ge':
              this.greaterOrEq = $match[$i + 1];
              break;
            default:
              break;
          }
        }
      }
    }
    if (params && params.hasOwnProperty('noPagination')) {
      this.noPagination = params.noPagination === 'true' ? BooleanEnum.true : BooleanEnum.false;
    }
  }

  initWithParams(
    params: Params,
    lower: string,
    lowerOrEq: string,
    eq: string,
    greater: string,
    greaterOrEq: string): Observable<HttpResponse<Category[]>> {

    this.lower = lower;
    this.lowerOrEq = lowerOrEq;
    this.eq = eq;
    this.greater = greater;
    this.greaterOrEq = greaterOrEq;
    return this.init(undefined, undefined, params);
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = super.setHttpParameters(httpParams);

    if (this.lower || this.lowerOrEq || this.eq || this.greater || this.greaterOrEq) {
      let val = '';
      if (this.lower) { val = 'l' + this.lower; }
      if (this.lowerOrEq) { val = 'le' + this.lowerOrEq; }
      if (this.eq) { val = 'e' + this.eq; }
      if (this.greater) { val = 'g' + this.greater; }
      if (this.greaterOrEq) { val = 'ge' + this.greaterOrEq; }
      httpParams = httpParams.append('subCategoryCount', val);
    }
    if (this.noPagination) {
      httpParams = httpParams.append('noPagination', this.noPagination);
    }
    return httpParams;
  }

  removeParamsFromUrl(query: {}) {
    super.removeParamsFromUrl(query);
    this.removeParam(query, 'subCategoryCount');
    this.removeParam(query, 'noPagination');
  }

  newValue(x: any): Category {
    return new Category(x);
  }

  canEditOrDelete(category: Category) {
    return this.isValidator ? !category.askValidate : !category.validate;
  }

  onUpdateDone(simple: SimpleChange) {
    this.createUpdateDelete(simple);
  }

}
