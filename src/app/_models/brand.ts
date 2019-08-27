import { Equipment } from './equipment';

export class Brand {
  id: number;
  name: string;
  description: string;
  uri: string;
  equipments: Equipment[];
}
