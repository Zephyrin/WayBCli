import { Params, Router, ActivatedRoute } from '@angular/router';
import { HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Pagination } from '@app/_models/helpers/pagination';

export abstract class PaginationAndParamsService {

  public pagination: Pagination;
  private isInit = false;
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
    router.navigate(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: query,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
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
    if (page >= this.pagination.firstPage && page <= this.pagination.lastPage) {
      if (this.pagination.paginationPage !== page) {
        this.pagination.paginationPage = page;
        if (!this.isInit) { this.changePage(); }
      }
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
    return (this.pagination.paginationPage - 1) * this.pagination.paginationLimit + 1;
  }

  /**
   * Return the total of records already read @see posBeginCount() plus the
   * number of record of current page.
   */
  posEndCount() {
    const ret = this.posBeginCount() - 1 + this.pagination.paginationCount;
    if (ret > this.total()) {
      return this.total();
    }
    return ret;
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
