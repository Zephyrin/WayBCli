import { Params, Router, ActivatedRoute } from '@angular/router';
import { HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Pagination } from '@app/_models/helpers/pagination';
import { BooleanEnum } from '@app/_enums/boolean.enum';
import { FormErrors } from '@app/_errors';
import { HttpService } from '../http.service';
import { SimpleChange, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class PaginationAndParamsService<T> {
  public values: T[];
  public selected: T;

  public errors: FormErrors;
  public loading = false;

  public pagination: Pagination;

  private isInit = false;
  public isValidator = false;

  /* Event to inform end of init */
  public initDone: EventEmitter<any> = new EventEmitter();

  /* HttpService */
  public httpService: HttpService<T>;

  /* Route and router for URL */
  private router: Router;
  private route: ActivatedRoute;

  constructor(
    httpService: HttpService<T>,
    pagination: Pagination = null) {
    this.httpService = httpService;
    if (pagination !== null) {
      this.pagination = pagination;
    } else {
      this.pagination = new Pagination();
    }
  }

  /**
   * Create a value based on JSON response.
   */
  abstract newValue(x: any): T;
  /**
   * Set http parameters just before sending the request getAll().
   */
  abstract setHttpParameters(httpParams: HttpParams): HttpParams;

  /**
   * Call to retrieve data when pagination change or filter.
   */
  changePage(): Observable<HttpResponse<T[]>> {
    this.loading = true;
    this.errors = new FormErrors();
    let httpParams = this.getHttpParameters();
    httpParams = this.setHttpParameters(httpParams);
    this.paramsIntoUrl(httpParams);
    const obs = this.httpService.getAll(httpParams);
    obs.subscribe(response => {
      this.loading = false;
      this.setParametersFromResponse(response.headers);
      this.values = response.body.map(x => this.newValue(x));
      this.initDone.emit(null);
      return response;
    });
    return obs;
  }

  /**
   * Get the list of element.
   */
  public list(): T[] { return this.values; }

  /**
   * Display the name of an element.
   */
  public displayName(elt: T): string {
    const field = 'name';
    if (elt.hasOwnProperty(field)) { return elt[field]; }
    return '';
  }

  /**
   * Return the id of elt.
   * @param elt the element.
   */
  public getId(elt: T): number {
    const field = 'id';
    if (elt.hasOwnProperty(field)) { return elt[field]; }
    return -1;
  }

  /**
   * Add elt into the list. You have to call add() to update the pagination
   * system.
   * @param elt the element that has been added
   */
  addElement(elt: T): void {
    this.values.push(this.newValue(elt));
    this.add();
  }

  valueAdded(simpleChange: SimpleChange) {
    setTimeout(() => {
      if (simpleChange) {
        if (simpleChange.previousValue === null) {
          this.addElement(simpleChange.currentValue);
        } else if (simpleChange.currentValue === null) {
          this.deleteElement(simpleChange.previousValue);
        } else {
          Object.assign(simpleChange.previousValue, simpleChange.currentValue);
        }
      }
    });
  }

  /**
   * Delete elt from the list. You have to call delete() to update the
   *  pagination system.
   * @param elt the element that has been deleted
   */
  deleteElement(elt: T): void {
    const index = this.values.indexOf(elt);
    if (index >= 0) {
      this.values.splice(index, 1);
      this.delete();
    }
  }

  public init(router: Router, route: ActivatedRoute, params: Params): Observable<HttpResponse<T[]>> {
    this.route = route;
    this.router = router;
    this.errors = new FormErrors();

    this.setDefaultParamsFromUrl(params);
    return this.changePage();
  }

  setSelected(value: T) {
    if (!this.loading) {
      if (this.selected !== value) {
        this.selected = value;
        this.errors = new FormErrors();
      }
    }
  }

  updateAskValidate(value: T) {
    this.updateBoolean(value, 'askValidate');
  }

  updateValidate(value: T) {
    this.updateBoolean(value, 'validate');
  }

  updateBoolean(value: T, field: string) {
    this.errors = new FormErrors();

    if (value.hasOwnProperty(field) && this.httpService) {
      this.setSelected(value);
      this.loading = true;
      value[field] = !value[field];
      this.httpService.update(value)
        .subscribe(returnValue => {
          this.loading = false;
        }, (error: any) => {
          this.errors.formatError(error);
          value[field] = !value[field];
          this.loading = false;
        });
    }
  }

  /**
   * Make the circle of boolean true -> false -> undefined -> true.
   *
   * @param bool previous state of the boolean
   */
  public booleanCycle(bool: BooleanEnum) {
    switch (bool) {
      case BooleanEnum.false:
        return BooleanEnum.undefined;
      case BooleanEnum.undefined:
        return BooleanEnum.true;
      case BooleanEnum.true:
        return BooleanEnum.false;
    }
  }

  /**
   * Add something to the list
   */
  protected add() {
    this.pagination.paginationCount++;
    this.pagination.totalCount++;
  }

  /**
   * Delete something to the list.
   */
  protected delete() {
    this.pagination.paginationCount--;
    this.pagination.totalCount--;
  }

  /**
   * Define pagination parameters from url parameters.
   *
   * {Params} params is given via this.route.queryParams.subscribe(params) in ngOnInit
   */
  setDefaultParamsFromUrl(params: Params) {
    this.isInit = true;
    if (params && params.hasOwnProperty('page')) {
      this.goTo(parseInt(params.page ? params.page : '1', 10));
    } else {
      this.goTo(1);
    }
    if (params && params.hasOwnProperty('limit')) {
      this.setLimit(parseInt(params.limit ? params.limit : '10', 10));
    } else {
      this.setLimit(10);
    }
    this.isInit = false;
  }

  /**
   * Helper to get BooleanEnum from param.
   */
  getBooleanParam(params: Params, name: string) {
    if (params && params.hasOwnProperty(name)) {
      if (Object.values(BooleanEnum).includes(params[name])) {
        return params[name];
      }
      return BooleanEnum.undefined;
    }
    return BooleanEnum.undefined;
  }

  /**
   * Return httpParams set with pagination information.
   */
  getHttpParameters() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'page', this.pagination.paginationPage.toString()
    );
    httpParams = httpParams.append(
      'limit', this.pagination.paginationLimit.toString()
    );
    return httpParams;
  }

  /**
   * Retrieve pagination information from get answer.
   *
   * @param response The response of HTTP whit get pagination information
   */
  setParametersFromResponse(headers: HttpHeaders) {
    this.isInit = true;
    let ret = headers.get('X-Total-Count');
    this.pagination.totalCount = parseInt(ret === null ? '0' : ret, 10);
    ret = headers.get('X-Pagination-Count');
    this.pagination.paginationCount = parseInt(ret === null ? '0' : ret, 10);
    ret = headers.get('X-Pagination-Page');
    this.goTo(parseInt(ret === null ? '0' : ret, 10));
    ret = headers.get('X-Pagination-Limit');
    this.setLimit(parseInt(ret === null ? '0' : ret, 10));
    this.pagination.lastPage = Math.ceil(
      this.pagination.totalCount / this.pagination.paginationLimit
    );
    this.isInit = false;
  }

  /**
   * To remove a parameter from the URL that has been already set, you should
   * set the param to null like this:
   * this.removeParam(query, 'name');
   * @see removeParam
   */
  abstract removeParamsFromUrl(query: {}): void;

  /**
   * Helpers to remove a param from query.
   */
  removeParam(query: {}, name: string): void {
    if (!query.hasOwnProperty(name)) {
      query[name] = null;
    }
  }
  /**
   * Change navigator URL with information from httpParams.
   *
   * @param httpParams Parameters use to call HTTP Get
   */
  paramsIntoUrl(
    httpParams: HttpParams) {
    const query = {};
    httpParams.keys().forEach(key => {
      const val = httpParams.get(key);
      query[key] = val;
    });
    this.removeParamsFromUrl(query);
    if (this.router && this.route) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: query,
          queryParamsHandling: 'merge'
        });
    }
  }

  /**
   * Return the limit used.
   */
  limit() {
    return this.pagination.paginationLimit;
  }

  /**
   * Set the limit.
   *
   * @param limit the new limit.
   */
  setLimit(limit: number) {
    if (limit > 0 && this.pagination.paginationLimit !== limit) {
      this.pagination.paginationLimit = limit;
      if (!this.isInit) { this.changePage(); }
    }
  }

  /**
   * Set page to the first.
   */
  goToFirst() {
    if (this.pagination.paginationPage !== this.pagination.firstPage) {
      this.pagination.paginationPage = this.pagination.firstPage;
      this.changePage();
    }
  }
  /**
   * Set previous page of pagination.
   */
  goToPrevious() {
    this.pagination.paginationPage--;
    if (this.pagination.paginationPage < this.pagination.firstPage) {
      this.pagination.paginationPage = this.pagination.firstPage;
    } else if (this.pagination.paginationPage > this.pagination.lastPage) {
      this.pagination.paginationPage = this.pagination.lastPage;
    } else {
      if (!this.isInit) { this.changePage(); }
    }
  }

  /**
   * Set page to pagination if page is upper or equal of the firstPage (1) and
   * lower or equal of the lastPage.
   *
   * @param page the new page of pagination.
   */
  goTo(page: number) {
    if (!this.isInit && page >= this.pagination.firstPage && page <= this.pagination.lastPage) {
      if (this.pagination.paginationPage !== page) {
        this.pagination.paginationPage = page;
        if (!this.isInit) { this.changePage(); }
      }
    } else {
      this.pagination.paginationPage = page;
    }
  }

  /**
   * Set next page of pagination.
   */
  goToNext() {
    this.pagination.paginationPage++;
    if (this.pagination.paginationPage > this.pagination.lastPage) {
      this.pagination.paginationPage = this.pagination.lastPage;
    } else {
      if (!this.isInit) { this.changePage(); }
    }
  }

  /**
   * Set page to the last.
   */
  goToLast() {
    if (this.pagination.paginationPage < this.pagination.lastPage) {
      this.pagination.paginationPage = this.pagination.lastPage;
      this.changePage();
    }
  }

  /**
   * Return the number of records already read. For example, your are at the
   * page 3 with a limit of 10, then you already got 20 records.
   */
  posBeginCount() {
    return (this.page() - 1) * this.limit() + 1;
  }

  /**
   * Return the total of records already read @see posBeginCount() plus the
   * number of record of current page.
   */
  posEndCount() {
    if (this.pagination.paginationCount > this.total()) {
      return this.total();
    }
    return this.pagination.paginationCount;
  }

  isFirst() {
    return this.pagination.paginationPage <= this.pagination.firstPage;
  }

  hasPreviousPage(step = 10) {
    return this.pagination.paginationPage - step > this.pagination.firstPage;
  }

  getPreviousPage(step = 10) {
    return this.pagination.paginationPage - step;
  }

  /**
   * Return the current page.
   */
  page() {
    return this.pagination.paginationPage;
  }

  hasNextPage(step = 10) {
    return this.pagination.paginationPage + step < this.pagination.lastPage;
  }

  getNextPage(step = 10) {
    return this.pagination.paginationPage + step;
  }

  isLast() {
    return this.pagination.paginationPage >= this.pagination.lastPage;
  }
  /**
   * Return the total of page.
   */
  totalPage() {
    return this.pagination.lastPage;
  }

  /**
   * Return the number total of records.
   */
  total() {
    return this.pagination.totalCount;
  }
}
