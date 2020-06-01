import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Route, Params } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { BrandService } from './brand.service';

import { Brand } from '@app/_models';
import { FormErrors } from '@app/_errors';
import { environment } from '@environments/environment';
import { SortEnum, SortByEnum } from '@app/_enums/brand.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

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
  /* Part of PaginationAndParamsService */
  displayName(elt: any): string {
    if (elt instanceof Brand) {
      return elt.name;
    }
    return '';
  }

  getId(elt: any): number {
    if (elt instanceof Brand) {
      return elt.id;
    }
    return -1;
  }

  list(): any[] {
    return this.brands;
  }

  setSearch(text: string) {
    this.search = text.trim();
    this.changePage();
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

  setDefaultParamsFormUrl(params: Params, isValidator) {
    super.setDefaultParamsFromUrl(params, isValidator);
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
      if (isValidator && !params.hasOwnProperty('page')) {
        this.validate = BooleanEnum.false;
      } else {
        this.validate = BooleanEnum.undefined;
      }
    }
    if (params && params.hasOwnProperty('askValidate')) {
      if (Object.values(BooleanEnum).includes(params.askValidate)) {
        this.askValidate = params.askValidate;
      } else { this.askValidate = BooleanEnum.undefined; }
    } else {
      // Look if param is empty, means it comes from router link. Otherwise
      // it is the choice of the user.
      if (isValidator && !params.hasOwnProperty('page')) {
        this.askValidate = BooleanEnum.true;
      } else {
        this.askValidate = BooleanEnum.undefined;
      }
    }
  }

  init(router: Router, route: ActivatedRoute, params: Params, isValidator) {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();
    this.setDefaultParamsFromUrl(params, isValidator);

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

  updateValidate(brand: Brand) {
    this.errors = new FormErrors();
    this.setSelected(brand);
    this.loading = true;
    brand.validate = !brand.validate;
    this.service.update(brand)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        brand.validate = !brand.validate;
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
    return this.isValidator ? brand.askValidate : !brand.validate;
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
