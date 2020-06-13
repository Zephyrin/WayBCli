import { Injectable } from '@angular/core';
import { BackpackService } from './backpack.service';

import { Backpack, User, Have } from '@app/_models';
import { SortByEnum } from '@app/_enums/backpack.enum';

import { ValidationAndSearchService } from '../helpers/validation-and-search.service';
import { IntoBackpack } from '@app/_models/into-backpack';

@Injectable({
  providedIn: 'root'
})
export class BackpackPaginationSearchService extends ValidationAndSearchService<Backpack> {

  set userId(id: number) {
    this.userId$ = id;
    this.service.userId = this.userId$;
  }
  get userId(): number {
    return this.userId$;
  }
  private userId$: number;

  public user: User;

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
    const n = new Backpack(x);
    if (this.user !== undefined) {
      this.user.haves.forEach(have => {
        const elts = n.intoBackpacks.filter(into => into.have.id === have.id);
        if (elts.length > 0) {
          elts.forEach(elt => {
            have.usedOwned += elt.count;
            if (have.ownQuantity >= have.usedOwned) {
              have.wantForUsed = have.usedOwned - have.ownQuantity;
              have.usedOwned = have.ownQuantity;
            }
          });
        }
      });
    }
    return n;
  }

  canEditOrDelete(backpack: Backpack) {
    if (backpack !== undefined) { return backpack.createdBy.id === this.userId; }
    return false;
  }


  addHaveToBackpack(have: Have) {
    if (this.selected !== undefined) {
      const into = new IntoBackpack(null);
      into.count = 1;
      into.have = have;
      have.usedOwned = have.usedOwned === undefined ? 1 : have.usedOwned + 1;
      this.selected.addInto(into);
    }
  }

  removeIntoBackpack(into: IntoBackpack) {
    if (this.selected !== undefined) {
      const haves = this.selected.createdBy.haves.filter(elt => elt.id === into.have.id);
      if (haves.length > 0) {
        haves.forEach(have => {
          if (have.wantForUsed === undefined) { have.wantForUsed = 0; }
          have.wantForUsed -= into.count;
          if (have.wantForUsed < 0) {
            have.usedOwned += have.wantForUsed;
            have.wantForUsed = 0;
            if (have.usedOwned < 0) { have.usedOwned = 0; }
          }
        });
      }
      into.count = 0;
      const index = this.selected.intoBackpacks.indexOf(into);
      if (index >= 0) {
        this.selected.intoBackpacks.splice(index, 1);
      }
    }
  }
}
