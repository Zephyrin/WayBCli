import { Equipment } from './equipment';
import { User } from './user';
import { Mediaobject } from './mediaobject';
import { Validation } from './validation';

export class Brand extends Validation {
  id: number;
  name: string;
  uri: string;
  equipments: Equipment[];
  createdBy: User;
  logo: Mediaobject;

  constructor(brand: Brand = null) {
    super(brand);
    if (brand !== null && brand !== undefined) {
      this.id = brand.id;
      this.name = brand.name;
      this.uri = brand.uri;
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
