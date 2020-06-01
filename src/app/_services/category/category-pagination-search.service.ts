import { Injectable, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Params } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { CategoryService } from './category.service';

import { Category } from '@app/_models';
import { FormErrors } from '@app/_errors';
import { SortEnum, SortByEnum } from '@app/_enums/category.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

@Injectable({
  providedIn: 'root'
})
export class CategoryPaginationSearchService extends PaginationAndParamsService {
  public categories: Category[];
  public selected: Category;
  public errors: FormErrors;
  public loading = false;

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

  /* Route and router for URL */
  private router: Router;
  private route: ActivatedRoute;

  constructor(
    private service: CategoryService) {
    super();
  }

  /* Part of PaginationAndParamsService */
  displayName(elt: any): string {
    if (elt instanceof Category) {
      return elt.name;
    }
    return '';
  }

  getId(elt: any): number {
    if (elt instanceof Category) {
      return elt.id;
    }
    return -1;
  }
  list(): any[] {
    return this.categories;
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

  setDefaultParamsFromUrl(params: Params, isValidator) {
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

  init(router: Router, route: ActivatedRoute, params: Params, isValidator: boolean, noPagination = false) {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();
    this.setDefaultParamsFromUrl(params === undefined ? params : params.params, isValidator);
    this.changePage();
  }

  initWithParams(
    router: Router,
    route: ActivatedRoute,
    params: Params,
    isValidator: boolean,
    noPagination: boolean,
    lower: string,
    lowerOrEq: string,
    eq: string,
    greater: string,
    greaterOrEq: string) {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();
    this.setDefaultParamsFromUrl(params === undefined ? params : params.params, isValidator);
    this.lower = lower;
    this.lowerOrEq = lowerOrEq;
    this.eq = eq;
    this.greater = greater;
    this.greaterOrEq = greaterOrEq;
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
    if (this.lower || this.lowerOrEq || this.eq || this.greater || this.greaterOrEq) {
      let val = '';
      if (this.lower) { val = 'l' + this.lower; }
      if (this.lowerOrEq) { val = 'lE' + this.lowerOrEq; }
      if (this.eq) { val = 'e' + this.eq; }
      if (this.greater) { val = 'g' + this.greater; }
      if (this.greaterOrEq) { val = 'gE' + this.greaterOrEq; }
      httpParams = httpParams.append('subCategoryCount', val);
    }
    this.paramsIntoUrl(httpParams, this.router, this.route);
    this.service.getAll(httpParams).subscribe(categories => {
      this.loading = false;
      this.setParametersFromResponse(categories.headers);
      this.categories = categories.body.map(x => new Category(x));
    });
  }

  setSelected(category: Category) {
    if (!this.loading) {
      if (this.selected !== category) {
        this.selected = category;
        this.errors = new FormErrors();
      }
    }
  }

  updateAskValidate(category: Category) {
    this.errors = new FormErrors();
    this.setSelected(category);
    this.loading = true;
    category.askValidate = !category.askValidate;
    this.service.update(category)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        category.askValidate = !category.askValidate;
        this.loading = false;
      });
  }

  updateValidate(category: Category) {
    this.errors = new FormErrors();
    this.setSelected(category);
    this.loading = true;
    category.validate = !category.validate;
    this.service.update(category)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        category.validate = !category.validate;
        this.loading = false;
      });
  }

  canEditOrDelete(category: Category) {
    return this.isValidator ? !category.askValidate : !category.validate;
  }

  onUpdateDone(simple: SimpleChange) {
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.categories.push(simple.currentValue);
        } else if (simple.currentValue === null) {
          const index = this.categories.indexOf(simple.previousValue);
          if (index > 0) {
            this.categories.splice(index, 1);
          }
        } else {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        /* this.cd.detectChanges(); */
      }
    });
  }

  addElement(category: Category) {
    this.categories.push(category);
    super.add();
  }

  deleteElement(category: Category) {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
      super.delete();
    }
  }

}
