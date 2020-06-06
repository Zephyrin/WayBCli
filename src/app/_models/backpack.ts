import { IntoBackpack } from './into-backpack';
import { User } from './user';

export class Backpack {
  id: number;
  name: string;
  intoBackpacks: IntoBackpack[];
  createdBy: User;

  constructor(backpack: Backpack = null) {
    if (backpack !== null && backpack !== undefined) {
      this.id = backpack.id;
      this.name = backpack.name;
      this.intoBackpacks = backpack.intoBackpacks;
      this.createdBy = new User(backpack.createdBy);
    }
  }
}
