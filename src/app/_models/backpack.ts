import { IntoBackpack } from './into-backpack';
import { User } from './user';

export class Backpack {
  id: number;
  name: string;
  intoBackpacks: IntoBackpack[];
  createdBy: User;
  private weight$ = 0;
  private price$ = 0;
  private totalOwn$ = 0;
  private totalWish$ = 0;

  constructor(backpack: Backpack = null) {
    if (backpack !== null && backpack !== undefined) {
      this.id = backpack.id;
      this.name = backpack.name;
      this.intoBackpacks = [];
      backpack.intoBackpacks.forEach((into) => {
        this.intoBackpacks.push(new IntoBackpack(into));
      });
      this.createdBy = new User(backpack.createdBy);
      this.price$ = backpack.price$;
      this.weight$ = backpack.weight$;
      this.totalOwn$ = backpack.totalOwn$;
      this.totalWish$ = backpack.totalWish$;
    }
  }

  addInto(into: IntoBackpack) {
    this.intoBackpacks.push(into);
    this.weight$ += into.equipment.characteristic.weight;
    this.price$ += into.equipment.characteristic.price;
    this.totalOwn$ += into.equipment.usedOwned ? into.equipment.usedOwned : 0;
    this.totalWish$ += into.equipment.wantForUsed
      ? into.equipment.wantForUsed
      : 0;
  }

  removeInto(into: IntoBackpack) {
    const index = this.intoBackpacks.indexOf(into);
    if (index >= 0) {
      this.intoBackpacks.splice(index, 1);
      this.weight$ -= into.equipment.characteristic.weight;
      this.price$ -= into.equipment.characteristic.price;
      this.totalOwn$ -= into.equipment.usedOwned ? into.equipment.usedOwned : 0;
      this.totalWish$ -= into.equipment.wantForUsed
        ? into.equipment.wantForUsed
        : 0;
    }
  }

  countWeight() {
    if (this.weight$ === undefined) {
      this.weight$ = 0;
    }
    if (this.weight$ === 0) {
      this.intoBackpacks.forEach((into) => {
        this.weight$ += into.equipment.characteristic.weight * into.count;
      });
    }
    return this.weight$;
  }

  countPrice() {
    if (this.price$ === undefined) {
      this.price$ = 0;
    }
    if (this.price$ === 0) {
      this.intoBackpacks.forEach((into) => {
        this.price$ += into.equipment.characteristic.price * into.count;
      });
    }
    return this.price$;
  }

  countTotalWish() {
    if (this.totalWish$ === undefined) {
      this.totalWish$ = 0;
    }
    if (this.totalWish$ === 0) {
      this.intoBackpacks.forEach((into) => {
        this.totalWish$ += into.equipment.wantForUsed
          ? into.equipment.wantForUsed
          : 0;
      });
    }
    return this.totalWish$;
  }

  countTotalOwn() {
    if (this.totalOwn$ === undefined) {
      this.totalOwn$ = 0;
    }
    if (this.totalOwn$ === 0) {
      this.intoBackpacks.forEach((into) => {
        this.totalOwn$ += into.equipment.usedOwned
          ? into.equipment.usedOwned
          : 0;
      });
    }
    return this.totalOwn$;
  }
}
