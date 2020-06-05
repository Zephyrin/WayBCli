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

  constructor(private service: BrandService) {
    super(service);
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
    return this.isValidator ? brand.askValidate : !brand.validate;
  }
}
