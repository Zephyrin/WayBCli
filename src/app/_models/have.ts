import { Equipment } from './equipment';
import { Characteristic } from './characteristic';

export class Have {
  id: number;
  ownQuantity: number;
  wantQuantity: number;
  equipment: Equipment;
  characteristic: Characteristic;

  constructor(have: Have = null) {
    if (have) {
      this.id = have.id;
      this.ownQuantity = have.ownQuantity;
      this.wantQuantity = have.wantQuantity;
      this.equipment = new Equipment(have.equipment);
      this.characteristic = new Characteristic(have.characteristic);
    }
  }
}
