import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

import { HttpService } from '@app/_services/http.service';

import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';

import { BooleanEnum } from '@app/_enums/boolean.enum';


@Injectable({
  providedIn: 'root'
})
export abstract class ValidationAndSearchService<T> extends PaginationAndParamsService<T> {

  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';

  constructor(service: HttpService<T>) {
    super(service);
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

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);

    if (params && params.hasOwnProperty('search')) {
      this.search = params.search;
    } else { this.search = ''; }
    this.validate = this.getBooleanParam(params, 'validate');
    this.askValidate = this.getBooleanParam(params, 'askValidate');
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    if (this.validate !== BooleanEnum.undefined) {
      httpParams = httpParams.append('validate', this.validate);
    }
    if (this.askValidate !== BooleanEnum.undefined) {
      httpParams = httpParams.append('askValidate', this.askValidate);
    }
    if (this.search !== '') {
      httpParams = httpParams.append('search', this.search);
    }
    return httpParams;
  }

  removeParamsFromUrl(query: {}) {
    this.removeParam(query, 'search');
    this.removeParam(query, 'validate');
    this.removeParam(query, 'askValidate');
  }
}
