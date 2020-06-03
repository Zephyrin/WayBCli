import { Injectable } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { ValidationAndSearchService } from '../helpers/validation-and-search.service';
import { EquipmentService } from './equipment.service';

import { Equipment, User } from '@app/_models';
import { SortEnum, SortByEnum } from '@app/_enums/equipment.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentPaginationSearchService extends ValidationAndSearchService<Equipment> {
  public currentUser: User;

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.name;
  public validate = BooleanEnum.undefined;
  public askValidate = BooleanEnum.undefined;
  public search = '';
  public owned = BooleanEnum.undefined;
  public wishes = BooleanEnum.undefined;
  public others = BooleanEnum.undefined;

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

  filterOwned() {
    this.owned = this.booleanCycle(this.owned);
    this.changePage();
  }

  filterWishes() {
    this.wishes = this.booleanCycle(this.wishes);
    this.changePage();
  }

  filterOthers() {
    this.others = this.booleanCycle(this.others);
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

    this.owned = this.getBooleanParam(params, 'owned');
    this.wishes = this.getBooleanParam(params, 'wishes');
    this.others = this.getBooleanParam(params, 'others');
  }

  removeParamsFromUrl(query: {}) {
    super.removeParamsFromUrl(query);
    if (!query.hasOwnProperty('owned')) {
      query[`owned`] = null;
    }
    if (!query.hasOwnProperty('wishes')) {
      query[`wishes`] = null;
    }
    if (!query.hasOwnProperty('wishes')) {
      query[`wishes`] = null;
    }
  }
  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = super.setHttpParameters(httpParams);
    if (this.owned !== BooleanEnum.undefined) {
      httpParams = httpParams.append('owned', this.owned);
    }
    if (this.wishes !== BooleanEnum.undefined) {
      httpParams = httpParams.append('wishes', this.wishes);
    }
    if (this.others !== BooleanEnum.undefined) {
      httpParams = httpParams.append('others', this.others);
    }
    return httpParams;
  }
}
