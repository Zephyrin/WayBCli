import { Equipment } from './equipment';
import { User } from './user';
import { Mediaobject } from './mediaobject';

export class Brand {
  id: number;
  name: string;
  validate: boolean;
  askValidate: boolean;
  uri: string;
  equipments: Equipment[];
  createdBy: User;
  logo: Mediaobject;

  constructor(brand: Brand = null) {
    if (brand !== null && brand !== undefined) {
      this.id = brand.id;
      this.name = brand.name;
      this.validate = brand.validate;
      this.uri = brand.uri;
      this.askValidate = brand.askValidate;
      this.createdBy = brand.createdBy;
      this.logo = new Mediaobject(brand.logo);
    } else {
      this.logo = new Mediaobject();
    }
  }

  update(brand: Brand) {
    this.id = brand.id;
    this.name = brand.name;
    this.validate = brand.validate;
    this.uri = brand.uri;
    this.askValidate = brand.askValidate;
    this.createdBy = brand.createdBy;
    if (brand.logo !== null && brand.logo !== undefined) {
      this.logo.update(brand.logo);
    } else {
      this.logo = new Mediaobject();
    }
  }
}
