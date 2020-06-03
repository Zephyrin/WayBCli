import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { SortEnum, SortByEnum } from '@app/_enums/brand.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandPaginationSearchService extends PaginationAndParamsService<Brand> {

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;
  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';

  constructor(private service: BrandService) {
    super(service);
  }

  setSearch(text: string) {
    this.search = text.trim();
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

  filterValidate() {
    this.validate = this.booleanCycle(this.validate);
    this.changePage();
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

    if (params && params.hasOwnProperty('search')) {
      this.search = params.search;
    } else { this.search = ''; }

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
    return httpParams;
  }

  newValue(x: any): Brand {
    return new Brand(x);
  }

  getLogoUrl(brand: Brand) {
    return `${environment.mediaUrl}/${brand.logo.filePath}`;
  }

  returnUrl(uri: string) {
    return /^http(s)?:\/\//.test(uri) ? uri : 'https://' + uri;
  }

  canEditOrDelete(brand: Brand) {
    return this.isValidator ? brand.askValidate : !brand.validate;
  }
}
