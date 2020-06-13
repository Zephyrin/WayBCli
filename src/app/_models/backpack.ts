import { IntoBackpack } from './into-backpack';
import { User } from './user';

export class Backpack {
  id: number;
  name: string;
  intoBackpacks: IntoBackpack[];
  createdBy: User;
  private weight$ = 0;
  private price$ = 0;
  constructor(backpack: Backpack = null) {
    if (backpack !== null && backpack !== undefined) {
      this.id = backpack.id;
      this.name = backpack.name;
      this.intoBackpacks = [];
      backpack.intoBackpacks.forEach(into => {
        this.intoBackpacks.push(new IntoBackpack(into));
      });
      this.createdBy = new User(backpack.createdBy);
      this.price$ = backpack.price$;
      this.weight$ = backpack.weight$;
    }
  }

  addInto(into: IntoBackpack) {
    this.intoBackpacks.push(into);
    this.weight$ += into.have.characteristic.weight;
    this.price$ += into.have.characteristic.price;
  }

  removeInto(iton: IntoBackpack) {
    this.weight$ -= iton.have.characteristic.weight;
    this.price$ -= iton.have.characteristic.price;
  }

  countWeight() {
    if (this.weight$ === undefined) {
      this.weight$ = 0;
    }
    if (this.weight$ === 0) {
      this.intoBackpacks.forEach(into => {
        this.weight$ += into.have.characteristic.weight * into.count;
      });
    }
    return this.weight$;
  }

  countPrice() {
    if (this.price$ === undefined) {
      this.price$ = 0;
    }
    if (this.price$ === 0) {
      this.intoBackpacks.forEach(into => {
        this.price$ += into.have.characteristic.price * into.count;
      });
    }
    return this.price$;
  }
}
