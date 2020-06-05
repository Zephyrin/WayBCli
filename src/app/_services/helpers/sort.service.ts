import { Injectable } from '@angular/core';
import { PaginationAndParamsService } from './pagination-and-params.service';
import { HttpService } from '../http.service';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

import { SortEnum } from '@app/_enums/boolean.enum';

@Injectable({
  providedIn: 'root'
})
export abstract class SortService<T> extends PaginationAndParamsService<T> {

  public sort = SortEnum.asc;
  public set sortBy(sortByEnum: any) {
    if (Object.values(this.getSortByEnum()).includes(sortByEnum)) {
      this.sortByP = sortByEnum;
    }
  }
  public get sortBy() {
    return this.sortByP;
  }

  private sortByP: any;

  constructor(service: HttpService<T>) {
    super(service);
  }

  abstract getSortByEnum(): any;
  abstract getDefaultSortByEnum(): any;

  sortByOrOrient(sortByEnum: any) {
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
      if (Object.values(this.getSortByEnum()).includes(params.sortBy)) {
        this.sortBy = params.sortBy;
      } else { this.sortBy = this.getDefaultSortByEnum(); }
    } else { this.sortBy = this.getDefaultSortByEnum(); }
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = httpParams.append('sort', this.sort);
    httpParams = httpParams.append('sortBy', this.sortBy);
    return httpParams;
  }

  removeParamsFromUrl(query: {}) {
    this.removeParam(query, 'sort');
    this.removeParam(query, 'sortBy');
  }
}
