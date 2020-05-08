export class Characteristic {
  id: number;
  size: string;
  price: number;
  weight: number;
  gender: string;
  validate: boolean;
  askValidate: boolean;

  constructor(car: Characteristic = null) {
    if (car) {
      this.id = car.id;
      this.size = car.size;
      this.price = car.price;
      this.weight = car.weight;
      this.gender = car.gender;
      this.validate = car.validate;
      this.askValidate = car.askValidate;
    }
  }

  display(): string {
    let ret = '';
    if (this.size) {
      ret += this.size + ' | ';
    }
    if (this.gender) {
      ret += this.gender + ' | ';
    }
    if (this.price) {
      ret += this.price + ' | ';
    }
    if (this.weight) {
      ret += this.weight + 'g';
    }
    if (ret.length === 0) {
      ret = 'Other charecteristic';
    }
    return ret;
  }
}
