import { Injectable } from '@angular/core';
import { BackpackService } from './backpack.service';

import { Backpack, User } from '@app/_models';
import { SortByEnum } from '@app/_enums/backpack.enum';

import { ValidationAndSearchService } from '../helpers/validation-and-search.service';

@Injectable({
  providedIn: 'root'
})
export class BackpackPaginationSearchService extends ValidationAndSearchService<Backpack> {

  set userId(user: number) {
    this.userIdb = user;
    this.service.userId = this.userIdb;
  }
  get userId(): number {
    return this.userIdb;
  }
  private userIdb: number;

  constructor(private service: BackpackService) {
    super(service);
   }

   getSortByEnum() {
     return SortByEnum;
   }

   getDefaultSortByEnum() {
     return SortByEnum.name;
   }

   newValue(x: any): Backpack {
     return new Backpack(x);
   }

   canEditOrDelete(backpack: Backpack) {
    return backpack.createdBy.id === this.userId;
   }
}
