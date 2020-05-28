import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Route, Params } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { FormErrors } from '@app/_errors';
import { environment } from '@environments/environment';
import { sortEnum, sortByEnum, booleanEnum } from '@app/_enums/brand.enum';

@Injectable({
  providedIn: 'root'
})
export class BrandPaginationSearchService extends PaginationAndParamsService {
  public brands: Brand[];
  public selected: Brand;
  public errors: FormErrors;
  public loading = false;

  /* Search */
  public sort = sortEnum.asc;
  public sortBy = sortByEnum.name;
  public validate = booleanEnum.undefined;
  public askValidate = booleanEnum.undefined;
  public search = '';

  /* Route and router for URL */
  private router: Router;
  private route: ActivatedRoute;

  constructor(private service: BrandService) {
    super();
  }

  setDefaultParamsFormUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);
    if (params.hasOwnProperty('sort')) {
      if (Object.values(sortEnum).includes(params.sort)) {
        this.sort = params.sort;
      } else { this.sort = sortEnum.asc; }
    } else { this.sort = sortEnum.asc; }

    if (params.hasOwnProperty('sortBy')) {
      if (Object.values(sortByEnum).includes(params.sortBy)) {
        this.sortBy = params.sortBy;
      } else { this.sortBy = sortByEnum.name; }
    } else { this.sortBy = sortByEnum.name; }

    if (params.hasOwnProperty('validate')) {
      if (Object.values(booleanEnum).includes(params.validate)) {
        this.validate = params.validate;
      } else { this.validate = booleanEnum.undefined; }
    } else { this.validate = booleanEnum.undefined; }

    if (params.hasOwnProperty('askValidate')) {
      if (Object.values(booleanEnum).includes(params.askValidate)) {
        this.askValidate = params.askValidate;
      } else { this.askValidate = booleanEnum.undefined; }
    } else { this.askValidate = booleanEnum.undefined; }

    if (params.hasOwnProperty('search')) {
      this.search = params.search;
    } else { this.search = ''; }
  }

  init(router: Router, route: ActivatedRoute, params: Params) {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();
    this.setDefaultParamsFromUrl(params);
    this.changePage();
  }

  changePage(): void {
    this.loading = true;
    this.errors = new FormErrors();
    let httpParams = this.getHttpParameters();
    httpParams = httpParams.append('sort', this.sort);
    httpParams = httpParams.append('sortBy', this.sortBy);
    if (this.validate !== booleanEnum.undefined) {
      httpParams = httpParams.append('validate', this.validate);
    }
    if (this.askValidate !== booleanEnum.undefined) {
      httpParams = httpParams.append('askValidate', this.askValidate);
    }
    if (this.search !== '') {
      httpParams = httpParams.append('search', this.search);
    }
    this.paramsIntoUrl(httpParams, this.router, this.route);
    this.service.getAll(httpParams).subscribe(brands => {
      this.loading = false;
      this.setParametersFromResponse(brands.headers);
      this.brands = brands.body.map(x => new Brand(x));
    });
  }

  setSelected(brand: Brand) {
    if (!this.loading) {
      if (this.selected !== brand) {
        this.selected = brand;
        this.errors = new FormErrors();
      }
    }
  }

  updateAskValidate(brand: Brand) {
    this.errors = new FormErrors();
    this.setSelected(brand);
    this.loading = true;
    brand.askValidate = !brand.askValidate;
    this.service.update(brand)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        brand.askValidate = !brand.askValidate;
        this.loading = false;
      });
  }

  getLogoUrl(brand: Brand) {
    return `${environment.mediaUrl}/${brand.logo.filePath}`;
  }

  returnUrl(uri: string) {
    return /^http(s)?:\/\//.test(uri) ? uri : 'https://' + uri;
  }

  canEditOrDelete(brand: Brand) {
    return !brand.validate;
  }
}
