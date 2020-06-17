import { Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { BooleanEnum } from './../../_enums/boolean.enum';
import { Injectable } from '@angular/core';
import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { SortByEnum } from '@app/_enums/brand.enum';

import { environment } from '@environments/environment';
import { ValidationAndSearchService } from '../helpers/validation-and-search.service';

@Injectable({
  providedIn: 'root'
})
export class BrandPaginationSearchService extends ValidationAndSearchService<Brand> {

  public noPagination = BooleanEnum.undefined;

  constructor(public service: BrandService) {
    super(service);
  }

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);
    if (params && params.hasOwnProperty('noPagination')) {
      this.noPagination = params.noPagination === 'true' ? BooleanEnum.true : BooleanEnum.false;
    }
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = super.setHttpParameters(httpParams);
    if (this.noPagination) {
      httpParams = httpParams.append('noPagination', this.noPagination);
    }
    return httpParams;
  }

  removeParamsFromUrl(query: {}) {
    super.removeParamsFromUrl(query);
    this.removeParam(query, 'noPagination');
  }

  getSortByEnum() {
    return SortByEnum;
  }

  getDefaultSortByEnum() {
    return SortByEnum.name;
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
    return this.isValidator ? !brand.askValidate : !brand.validate;
  }
}
