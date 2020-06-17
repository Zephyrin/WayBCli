import { IntoBackpackService } from './../into-backpack.service';
import { Injectable } from '@angular/core';
import { BackpackHttpService } from './backpack.service';

import { Backpack, User, Have } from '@app/_models';
import { SortByEnum } from '@app/_enums/backpack.enum';

import { ValidationAndSearchService } from '../helpers/validation-and-search.service';
import { IntoBackpack } from '@app/_models/into-backpack';
import { FormErrors } from '@app/_errors';

@Injectable({
  providedIn: 'root',
})
export class BackpacksPaginationSearchService extends ValidationAndSearchService<
  Backpack
> {
  set userId(id: number) {
    this.userId$ = id;
    this.service.userId = this.userId$;
  }
  get userId(): number {
    return this.userId$;
  }

  /**
   * Local copy of the User->have used when a backpack is selected.
   */
  public haves: Have[];

  private userId$: number;

  public user: User;

  constructor(
    private service: BackpackHttpService,
    private serviceIntoBackpack: IntoBackpackService
  ) {
    super(service);
  }

  getSortByEnum() {
    return SortByEnum;
  }

  getDefaultSortByEnum() {
    return SortByEnum.name;
  }

  newValue(x: any, isInitSelected: boolean): Backpack {
    const n = new Backpack(x);
    if (isInitSelected && this.user) {
      this.haves = [];
      this.user.haves.forEach((val) => this.haves.push(Object.assign({}, val)));
      this.haves.forEach((have) => {
        const elts = n.intoBackpacks.filter(
          (into) => into.equipment.id === have.id
        );
        if (elts.length > 0) {
          elts.forEach((elt) => {
            this.addInto(elt, have);
          });
        }
      });
    }
    return n;
  }

  canEditOrDelete(backpack: Backpack) {
    if (backpack !== undefined) {
      return backpack.createdBy.id === this.userId;
    }
    return false;
  }

  addHaveToBackpack(have: Have, userId: number) {
    this.errors = new FormErrors();
    if (this.selected !== undefined) {
      this.loading = true;
      const into = new IntoBackpack(null);
      into.count = 1;
      into.equipment = have;
      this.serviceIntoBackpack.userId = userId;
      this.serviceIntoBackpack.backpackId = this.selected.id;
      this.serviceIntoBackpack.create(into).subscribe(
        (nInto) => {
          this.loading = false;
          nInto = new IntoBackpack(nInto);
          this.addInto(nInto, have);
          this.selected.addInto(nInto);
        },
        (error) => {
          this.loading = false;
          this.errors.formatError(error);
        }
      );
    }
  }

  removeIntoBackpack(into: IntoBackpack, userId: number) {
    this.errors = new FormErrors();
    if (this.selected !== undefined) {
      this.loading = true;
      this.serviceIntoBackpack.userId = userId;
      this.serviceIntoBackpack.backpackId = this.selected.id;
      this.serviceIntoBackpack.delete(into).subscribe(
        (success) => {
          this.deleteInto(into);
          this.loading = false;
        },
        (error) => {
          if (error.statusCode === '404') {
            this.deleteInto(into);
          } else {
            this.errors.formatError(error);
          }
          this.loading = false;
        }
      );
    }
  }

  private addInto(elt: IntoBackpack, have: Have): void {
    elt.equipment.usedOwned = elt.count;
    if (elt.equipment.usedOwned > elt.equipment.ownQuantity) {
      elt.equipment.wantForUsed =
        elt.equipment.usedOwned - elt.equipment.ownQuantity;
      elt.equipment.usedOwned = have.ownQuantity;
    }
    if (have.usedOwned === undefined) {
      have.usedOwned = 0;
    }
    if (have.wantForUsed === undefined) {
      have.wantForUsed = 0;
    }
    have.usedOwned += elt.count;
    if (have.ownQuantity < have.usedOwned) {
      have.wantForUsed = have.usedOwned - have.ownQuantity;
      have.usedOwned = have.ownQuantity;
    }
  }

  private deleteInto(into: IntoBackpack): void {
    const haves = this.haves.filter((elt) => elt.id === into.equipment.id);
    if (haves.length > 0) {
      haves.forEach((have) => {
        if (have.wantForUsed === undefined) {
          have.wantForUsed = 0;
        }
        if (have.usedOwned === undefined) {
          have.usedOwned = 0;
        }
        have.wantForUsed -= into.count;
        if (have.wantForUsed < 0) {
          have.usedOwned += have.wantForUsed;
          have.wantForUsed = 0;
          if (have.usedOwned < 0) {
            have.usedOwned = 0;
          }
        }
      });
    }
    into.count = 0;
    const index = this.selected.intoBackpacks.indexOf(into);
    if (index >= 0) {
      this.selected.intoBackpacks.splice(index, 1);
    }
  }

  /* Override methods */
  /* setSelected(value: Backpack) {
    if (this.user) {
      this.haves = Object.assign({}, this.user.haves);
    }
  } */
}
