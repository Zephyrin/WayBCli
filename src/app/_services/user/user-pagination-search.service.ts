import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

import { UserService } from '../user.service';

import { User, Role } from '@app/_models';
import { SortByEnum } from '@app/_enums/user.enum';
import { SortEnum } from '@app/_enums/boolean.enum';

import { PaginationAndParamsService } from '../helpers/pagination-and-params.service';
import { FormErrors } from '@app/_errors';

@Injectable({
  providedIn: 'root'
})
export class UserPaginationSearchService extends PaginationAndParamsService<User> {

  /* Search */
  public sort = SortEnum.asc;
  public sortBy = SortByEnum.username;

  constructor(private service: UserService) {
    super(service);
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
      } else { this.sortBy = SortByEnum.username; }
    } else { this.sortBy = SortByEnum.username; }
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

  newValue(x: any): User {
    return new User(x);
  }

  canEdit(user: User): boolean {
    return user.roles.indexOf(Role.SuperAdmin) === -1;
  }

  setSelected(user: User) {
    if (this.canEdit(user)) {
      super.setSelected(user);
    }
  }

  updateUser(user: User, role: Role) {
    if (user.roles.indexOf(role) === -1) {
      this.loading = true;
      const previousRole = user.roles;
      user.roles = [role];
      this.service.update(user).subscribe(ret => {
        this.endTransaction();
      }, error => {
        user.roles = previousRole;
        this.endTransactionError(error);
      });
    }
  }

  endTransaction() {
    this.loading = false;
  }

  endTransactionError(error) {
    this.loading = false;
    if (error) {
      this.errors.formatError(error);
    } else {
      this.errors = new FormErrors();
    }
  }
}
