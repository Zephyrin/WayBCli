import { Injectable, SimpleChange } from '@angular/core';
import { Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { CategoryService } from './category.service';

import { Category } from '@app/_models';
import { SortEnum, SortByEnum } from '@app/_enums/category.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

@Injectable({
  providedIn: 'root'
})
export class CategoryPaginationSearchService extends PaginationAndParamsService<Category> {

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;
  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';
  public lower: string = undefined;
  public lowerOrEq: string = undefined;
  public eq: string = undefined;
  public greater: string = undefined;
  public greaterOrEq: string = undefined;

  constructor(
    private service: CategoryService) {
    super(service);
  }

  setSearch(text: string) {
    this.search = text.trim();
    this.changePage();
  }

  filterValidate() {
    this.validate = this.booleanCycle(this.validate);
    this.changePage();
  }


  removeParamsFromUrl(query: {}) {
    if (!query.hasOwnProperty('search')) {
      query[`search`] = null;
    }
    if (!query.hasOwnProperty('validate')) {
      query[`validate`] = null;
    }
    if (!query.hasOwnProperty('askValidate')) {
      query[`askValidate`] = null;
    }
  }

  filterAskValidate() {
    this.askValidate = this.booleanCycle(this.askValidate);
    this.changePage();
  }

  sortByOrOrient(sortByEnum: SortByEnum) {
    if (this.sortBy === sortByEnum) {
      switch (this.sort) {
        case SortEnum.asc:
          this.sort = SortEnum.desc;
          break;
        case SortEnum.desc:
          this.sort = SortEnum.asc;
          break;
      }
    } else {
      this.sortBy = sortByEnum;
    }
    this.changePage();
  }

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);
    if (params && params.hasOwnProperty('sort')) {
      if (Object.values(SortEnum).includes(params.sort)) {
        this.sort = params.sort;
      } else { this.sort = SortEnum.asc; }
    } else { this.sort = SortEnum.asc; }

    if (params && params.hasOwnProperty('sortBy')) {
      if (Object.values(SortByEnum).includes(params.sortBy)) {
        this.sortBy = params.sortBy;
      } else { this.sortBy = SortByEnum.name; }
    } else { this.sortBy = SortByEnum.name; }

    if (params && params.hasOwnProperty('validate')) {
      if (Object.values(BooleanEnum).includes(params.validate)) {
        this.validate = params.validate;
      } else { this.validate = BooleanEnum.undefined; }
    } else {
        this.validate = BooleanEnum.undefined;
    }
    if (params && params.hasOwnProperty('askValidate')) {
      if (Object.values(BooleanEnum).includes(params.askValidate)) {
        this.askValidate = params.askValidate;
      } else { this.askValidate = BooleanEnum.undefined; }
    } else {
        this.askValidate = BooleanEnum.undefined;
    }
    if (params && params.hasOwnProperty('search')) {
      this.search = params.search;
    } else { this.search = ''; }
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
  }

  initWithParams(
    params: Params,
    lower: string,
    lowerOrEq: string,
    eq: string,
    greater: string,
    greaterOrEq: string) {

    this.lower = lower;
    this.lowerOrEq = lowerOrEq;
    this.eq = eq;
    this.greater = greater;
    this.greaterOrEq = greaterOrEq;
    this.init(undefined, undefined, params);
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = httpParams.append('sort', this.sort);
    httpParams = httpParams.append('sortBy', this.sortBy);
    if (this.validate !== BooleanEnum.undefined) {
      httpParams = httpParams.append('validate', this.validate);
    }
    if (this.askValidate !== BooleanEnum.undefined) {
      httpParams = httpParams.append('askValidate', this.askValidate);
    }
    if (this.search !== '') {
      httpParams = httpParams.append('search', this.search);
    }
    if (this.lower || this.lowerOrEq || this.eq || this.greater || this.greaterOrEq) {
      let val = '';
      if (this.lower) { val = 'l' + this.lower; }
      if (this.lowerOrEq) { val = 'lE' + this.lowerOrEq; }
      if (this.eq) { val = 'e' + this.eq; }
      if (this.greater) { val = 'g' + this.greater; }
      if (this.greaterOrEq) { val = 'gE' + this.greaterOrEq; }
      httpParams = httpParams.append('subCategoryCount', val);
    }
    return httpParams;
  }

  newValue(x: any): Category {
    return new Category(x);
  }

  canEditOrDelete(category: Category) {
    return this.isValidator ? !category.askValidate : !category.validate;
  }

  onUpdateDone(simple: SimpleChange) {
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.values.push(simple.currentValue);
        } else if (simple.currentValue === null) {
          const index = this.values.indexOf(simple.previousValue);
          if (index > 0) {
            this.values.splice(index, 1);
          }
        } else {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        /* this.cd.detectChanges(); */
      }
    });
  }

  addElement(category: Category) {
    this.values.push(category);
    super.add();
  }

  deleteElement(category: Category) {
    const index = this.values.indexOf(category);
    if (index >= 0) {
      this.values.splice(index, 1);
      super.delete();
    }
  }

}
