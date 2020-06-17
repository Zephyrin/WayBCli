import { Have } from './have';

export class IntoBackpack {
  id: number;
  count: number;
  equipment: Have;

  constructor(intoBackpack: IntoBackpack = null) {
    if (intoBackpack !== null && intoBackpack !== undefined) {
      this.id = intoBackpack.id;
      this.count = intoBackpack.count;
      this.equipment = new Have(intoBackpack.equipment);
    }
  }
}
