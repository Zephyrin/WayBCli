export class Characteristic {
  id: number;
  size: string;
  price: number;
  weight: number;
  gender: string;

  constructor(car: Characteristic = null) {
    if (car) {
      this.id = car.id;
      this.size = car.size;
      this.price = car.price;
      this.weight = car.weight;
      this.gender = car.gender;
    }
  }
}
