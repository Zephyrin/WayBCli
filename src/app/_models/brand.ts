import { Equipment } from './equipment';

export class Brand {
  id: number;
  name: string;
  description: string;
  uri: string;
  equipments: Equipment[];

  constructor(brand: Brand = null) {
    this.id = brand.id;
    this.name = brand.name;
    this.description = brand.description;
    this.uri = brand.uri;
  }
}
