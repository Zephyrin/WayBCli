import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Route, Params } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { FormErrors } from '@app/_errors';
import { environment } from '@environments/environment';
import { SortEnum, SortByEnum, BooleanEnum } from '@app/_enums/brand.enum';

@Injectable({
  providedIn: 'root'
})
export class BrandPaginationSearchService extends PaginationAndParamsService {
  public brands: Brand[];
  public selected: Brand;
  public errors: FormErrors;
  public loading = false;

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;
  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';

  /* Route and router for URL */
  private router: Router;
  private route: ActivatedRoute;

  constructor(private service: BrandService) {
    super();
  }

  setSearch(text: string) {
    const tt = text.trim();
    if (tt.trim() !== '') {
      if (tt !== this.search) {
        this.search = tt;
        this.changePage();
      }
    } else {
      if (this.search !== '') {
        this.search = '';
        this.changePage();
      }
    }
  }

  private filterBoolean(bool: BooleanEnum) {
    switch (bool) {
      case BooleanEnum.false:
        return BooleanEnum.undefined;
      case BooleanEnum.undefined:
        return BooleanEnum.true;
      case BooleanEnum.true:
        return BooleanEnum.false;
    }
  }
  filterValidate() {
    this.validate = this.filterBoolean(this.validate);
    this.changePage();
  }


  filterAskValidate() {
    this.askValidate = this.filterBoolean(this.askValidate);
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

  setDefaultParamsFormUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);
    if (params.hasOwnProperty('sort')) {
      if (Object.values(SortEnum).includes(params.sort)) {
        this.sort = params.sort;
      } else { this.sort = SortEnum.asc; }
    } else { this.sort = SortEnum.asc; }

    if (params.hasOwnProperty('sortBy')) {
      if (Object.values(SortByEnum).includes(params.sortBy)) {
        this.sortBy = params.sortBy;
      } else { this.sortBy = SortByEnum.name; }
    } else { this.sortBy = SortByEnum.name; }

    if (params.hasOwnProperty('validate')) {
      if (Object.values(BooleanEnum).includes(params.validate)) {
        this.validate = params.validate;
      } else { this.validate = BooleanEnum.undefined; }
    } else { this.validate = BooleanEnum.undefined; }

    if (params.hasOwnProperty('askValidate')) {
      if (Object.values(BooleanEnum).includes(params.askValidate)) {
        this.askValidate = params.askValidate;
      } else { this.askValidate = BooleanEnum.undefined; }
    } else { this.askValidate = BooleanEnum.undefined; }

    if (params.hasOwnProperty('search')) {
      this.search = params.search;
    } else { this.search = ''; }
  }

  init(router: Router, route: ActivatedRoute, params: Params) {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();
    this.setDefaultParamsFromUrl(params);
    if (params && params.hasOwnProperty('sort')) {
      if (Object.values(SortEnum).includes(params.sort)) {
        this.sort = params.sort;
      } else { this.sort = SortEnum.asc; }
    } else {
      this.sort = SortEnum.asc;
    }
    if (params && params.hasOwnProperty('sortBy')) {
      if (Object.values(SortByEnum).includes(params.sortBy)) {
        this.sortBy = params.sortBy;
      } else { this.sortBy = SortByEnum.name; }
    } else {
      this.sortBy = SortByEnum.name;
    }
    if (params && params.hasOwnProperty('search')) {
      this.search = params.search;
    } else {
      this.search = '';
    }
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
    this.changePage();
  }

  changePage(): void {
    this.loading = true;
    this.errors = new FormErrors();
    let httpParams = this.getHttpParameters();
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
    this.paramsIntoUrl(httpParams, this.router, this.route);
    this.service.getAll(httpParams).subscribe(brands => {
      this.loading = false;
      this.setParametersFromResponse(brands.headers, this.router, this.route);
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

  addElement(brand) {
    this.brands.push(brand);
    super.add();
  }

  deleteElement(brand: Brand) {
    const index = this.brands.indexOf(brand);
    if (index >= 0) {
      this.brands.splice(index, 1);
      super.delete();
    }
  }
}
