import { Params, Router, ActivatedRoute } from '@angular/router';
import { HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Pagination } from '@app/_models/helpers/pagination';
import { BooleanEnum } from '@app/_enums/boolean.enum';

export abstract class PaginationAndParamsService {

  public pagination: Pagination;
  private isInit = false;
  public isValidator = false;

  constructor(pagination: Pagination = null) {
    if (pagination !== null) {
      this.pagination = pagination;
    } else {
      this.pagination = new Pagination();
    }
  }

  /**
   * Call to retrieve data when pagination change or filter.
   */
  abstract changePage(): void;

  /**
   * Get the list of element.
   */
  abstract list(): any[];

  /**
   * Display the name of an element.
   */
  abstract displayName(elt: any): string;

  /**
   * Return the id of elt.
   * @param elt the element.
   */
  abstract getId(elt: any): number;

  /**
   * Add elt into the list. You have to call add() to update the pagination
   * system.
   * @param elt the element that has been added
   */
  abstract addElement(elt: any): void;

  /**
   * Delete elt from the list. You have to call delete() to update the
   *  pagination system.
   * @param elt the element that has been deleted
   */
  abstract deleteElement(elt: any): void;

  /**
   * Make the circle of boolean true -> false -> undefined -> true.
   *
   * @param bool previous state of the boolean
   */
  protected booleanCycle(bool: BooleanEnum) {
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
  setDefaultParamsFromUrl(params: Params, isValidator: boolean) {
    this.isInit = true;
    this.isValidator = isValidator;
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
   * Change navigator URL with information from httpParams.
   *
   * @param httpParams Parameters use to call HTTP Get
   * @param router intertface to update
   * @param activatedRoute the current route
   */
  paramsIntoUrl(
    httpParams: HttpParams,
    router: Router,
    activatedRoute: ActivatedRoute) {
    const query = {};
    httpParams.keys().forEach(key => {
      const val = httpParams.get(key);
      query[key] = val;
    });
    if (!query.hasOwnProperty('search')) {
      query[`search`] = null;
    }
    if (!query.hasOwnProperty('validate')) {
      query[`validate`] = null;
    }
    if (!query.hasOwnProperty('askValidate')) {
      query[`askValidate`] = null;
    }
    if (router && activatedRoute) {
      router.navigate(
        [],
        {
          relativeTo: activatedRoute,
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
