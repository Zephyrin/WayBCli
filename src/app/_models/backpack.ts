import { IntoBackpack } from './into-backpack';

export class Backpack {
  id: number;
  name: string;
  intoBackpacks: IntoBackpack[];

  constructor(backpack: Backpack = null) {
    if (backpack !== null && backpack !== undefined) {
      this.id = backpack.id;
      this.name = backpack.name;
      this.intoBackpacks = backpack.intoBackpacks;
    }
  }
}
