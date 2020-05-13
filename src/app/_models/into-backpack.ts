import { Have } from './have';

export class IntoBackpack {
  id: number;
  count: number;
  have: Have;

  constructor(intoBackpack: IntoBackpack = null) {
    if (intoBackpack !== null && intoBackpack !== undefined) {
      this.id = intoBackpack.id;
      this.count = intoBackpack.count;
      this.have = new Have(intoBackpack.have);
    }
  }
}
