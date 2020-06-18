import { HaveService } from '@app/_services/have.service';
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
    private serviceIntoBackpack: IntoBackpackService,
    private haveService: HaveService
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
      this.haveService.getAll(this.user.id).subscribe((haves) => {
        this.loading = false;
        this.haves = haves.map((have) => new Have(have));
        this.haves.forEach((have) => {
          const elts = n.intoBackpacks.filter(
            (into) =>
              into.equipment.characteristic.id === have.characteristic.id
          );
          if (elts.length > 0) {
            elts.forEach((elt) => {
              this.addInto(elt, have);
            });
          }
        });
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

  addHaveToBackpack(have: Have, userId: number, nb: number) {
    this.errors = new FormErrors();
    if (this.selected !== undefined) {
      this.loading = true;
      const into = new IntoBackpack(null);
      into.count = nb;
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

  updateOrRemoveIntoBackpack(into: IntoBackpack, userId: number, nb: number) {
    this.errors = new FormErrors();
    if (this.selected !== undefined) {
      this.loading = true;
      this.serviceIntoBackpack.userId = userId;
      this.serviceIntoBackpack.backpackId = this.selected.id;
      into.count = into.count + nb;
      if (into.count > 0) {
        this.serviceIntoBackpack.update(into).subscribe(
          (succes) => {
            if (nb < 0) {
              this.deleteInto(into, -nb);
            } else {
              this.updateInto(into, nb);
            }
            this.loading = false;
          },
          (error) => {
            this.errors.formatError(error);
            this.loading = false;
          }
        );
      } else {
        this.serviceIntoBackpack.delete(into).subscribe(
          (success) => {
            this.deleteInto(into, -nb);
            this.loading = false;
          },
          (error) => {
            if (error.statusCode === '404') {
              this.deleteInto(into, -nb);
            } else {
              this.errors.formatError(error);
            }
            this.loading = false;
          }
        );
      }
    }
  }

  private addInto(elt: IntoBackpack, have: Have): void {
    elt.equipment.usedOwned = elt.count;
    if (elt.equipment.usedOwned > elt.equipment.ownQuantity) {
      elt.equipment.wantForUsed =
        elt.equipment.usedOwned - elt.equipment.ownQuantity;
      elt.equipment.usedOwned = have.ownQuantity;
    }
    have.usedOwned += elt.count;
    if (have.ownQuantity < have.usedOwned) {
      have.wantForUsed = have.usedOwned - have.ownQuantity;
      have.usedOwned = have.ownQuantity;
    }
  }

  private updateInto(into: IntoBackpack, nb: number): void {
    let nbAddUsed = nb;
    let nbAddWant = 0;
    into.equipment.usedOwned += nb;
    if (into.equipment.usedOwned > into.equipment.ownQuantity) {
      nbAddWant = into.equipment.usedOwned - into.equipment.ownQuantity;
      nbAddUsed -= nbAddWant;
      into.equipment.wantForUsed += nbAddWant;
      into.equipment.usedOwned = into.equipment.ownQuantity;
    }
    const haves = this.haves.filter((elt) => elt.id === into.equipment.id);
    haves.forEach((have) => {
      have.usedOwned += nb;
      if (have.usedOwned > have.ownQuantity) {
        have.wantForUsed += have.usedOwned - have.ownQuantity;
        have.usedOwned = have.ownQuantity;
      }
    });
    this.selected.updateInto(into, nbAddUsed, nbAddWant);
  }
  /**
   * Remove nb IntoBackpacks from the backpack.
   *
   * @param into The equipment/characteristic that will be removed.
   * @param nb The number of equipment/characteristic that will be removed.
   */
  private deleteInto(into: IntoBackpack, nb: number): void {
    let nbRemoveUsed = 0;
    let nbRemoveWant = nb;
    into.equipment.wantForUsed -= nb;
    if (into.equipment.wantForUsed < 0) {
      into.equipment.usedOwned += into.equipment.wantForUsed;
      nbRemoveUsed -= into.equipment.wantForUsed;
      nbRemoveWant = nb - nbRemoveUsed;
      if (into.equipment.usedOwned < 0) {
        into.equipment.usedOwned = 0;
      }
      into.equipment.wantForUsed = 0;
    }
    const haves = this.haves.filter((elt) => elt.id === into.equipment.id);
    if (haves.length > 0) {
      haves.forEach((have) => {
        have.wantForUsed -= nb;
        if (have.wantForUsed < 0) {
          have.usedOwned += have.wantForUsed;
          have.wantForUsed = 0;
          if (have.usedOwned < 0) {
            have.usedOwned = 0;
          }
        }
      });
    }
    this.selected.removeInto(into, nb, nbRemoveUsed, nbRemoveWant);
  }

  /* Override methods */
  /* setSelected(value: Backpack) {
    if (this.user) {
      this.haves = Object.assign({}, this.user.haves);
    }
  } */
}
