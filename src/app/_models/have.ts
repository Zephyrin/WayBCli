import { Equipment } from './equipment';
import { Characteristic } from './characteristic';

export class Have {
  id: number;
  ownQuantity: number;
  wantQuantity: number;
  equipment: Equipment;
  characteristic: Characteristic;
}
