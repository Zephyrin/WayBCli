import { Injectable } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { EquipmentService } from './equipment.service';

import { Equipment, User } from '@app/_models';
import { SortEnum, SortByEnum } from '@app/_enums/equipment.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentPaginationSearchService extends PaginationAndParamsService<Equipment> {
  public currentUser: User;

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;
  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';

  constructor(private service: EquipmentService) {
    super(service);
  }

  newValue(x: any): Equipment {
    const equipment = new Equipment(x);
    if (this.currentUser.haves.some(
      have => have.equipment.id === equipment.id)) {
      equipment.has = true;
    }
    return equipment;
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

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);
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
      this.validate = BooleanEnum.undefined;
    }
    if (params && params.hasOwnProperty('askValidate')) {
      if (Object.values(BooleanEnum).includes(params.askValidate)) {
        this.askValidate = params.askValidate;
      } else { this.askValidate = BooleanEnum.undefined; }
    } else {
      this.askValidate = BooleanEnum.undefined;
    }
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {

    return httpParams;
  }
}
