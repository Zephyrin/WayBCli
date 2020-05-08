import { Equipment } from './equipment';

export class Brand {
  id: number;
  name: string;
  validate: boolean;
  askValidate: boolean;
  uri: string;
  equipments: Equipment[];

  constructor(brand: Brand = null) {
    if (brand !== null && brand !== undefined) {
      this.id = brand.id;
      this.name = brand.name;
      this.validate = brand.validate;
      this.uri = brand.uri;
      this.askValidate = brand.askValidate;
    }
  }
}
