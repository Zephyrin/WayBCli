import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { SortEnum, SortByEnum } from '@app/_enums/brand.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

import { environment } from '@environments/environment';
import { ValidationAndSearchService } from '../helpers/validation-and-search.service';

@Injectable({
  providedIn: 'root'
})
export class BrandPaginationSearchService extends ValidationAndSearchService<Brand> {

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;

  constructor(private service: BrandService) {
    super(service);
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

  removeParamsFromUrl(query: {}) {
    this.removeParam(query, 'sort');
    this.removeParam(query, 'sortBy');
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
