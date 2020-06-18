import { Equipment } from './equipment';
import { Characteristic } from './characteristic';

export class Have {
  id: number;
  ownQuantity: number;
  wantQuantity: number;
  equipment: Equipment;
  characteristic: Characteristic;

  /**
   * Not used by server.
   * Number of equipment into a backpack that used this equipment.
   */
  usedOwned = 0;
  /**
   * Not used by server.
   * Number of equipment that the user should buy to complete the backpack.
   */
  wantForUsed = 0;

  constructor(have: Have = null) {
    if (have) {
      this.id = have.id;
      this.ownQuantity = have.ownQuantity;
      this.wantQuantity = have.wantQuantity;
      this.equipment = new Equipment(have.equipment);
      this.characteristic = new Characteristic(have.characteristic);
      this.usedOwned = have.usedOwned;
      this.wantForUsed = have.wantForUsed;
      if (!this.usedOwned) {
        this.usedOwned = 0;
      }
      if (!this.wantForUsed) {
        this.wantForUsed = 0;
      }
    }
  }
}
