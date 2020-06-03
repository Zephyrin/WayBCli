import { Brand } from './brand';
import { Characteristic } from './characteristic';
import { SubCategory } from './sub-category';
import { User } from './user';
import { CurrencyPipe } from '@angular/common';
import { Validation } from './validation';

export class Equipment extends Validation {
  id: number;
  name: string;
  description: string;
  brand: Brand;
  characteristics: Characteristic[];
  subCategory: SubCategory;
  /**
   * Local variable to know if the user has this equipment or not.
   */
  has: boolean;
  createdBy: User;
  // haves: Have;
  private currencyPipe = new CurrencyPipe('EN');
  constructor(eq: Equipment = null) {
    super(eq);
    if (eq) {
      this.id = eq.id;
      this.name = eq.name;
      this.description = eq.description;
      if (eq.brand !== undefined && eq.brand !== null) {
        this.brand = new Brand(eq.brand);
      }
      this.characteristics = [];
      this.subCategory = new SubCategory(eq.subCategory);
      eq.characteristics.forEach(car => {
        this.characteristics.push(new Characteristic(car));
      });
      this.createdBy = eq.createdBy;
    }
    this.has = false;
  }

  compute(name: string) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;
    if (this.characteristics === null
      || this.characteristics === undefined
      || this.characteristics.length === 0) {
      return '0';
    }
    this.characteristics.forEach(caracteristic => {
      if (min > caracteristic[name]) {
        min = caracteristic[name];
      }
      if (max < caracteristic[name]) {
        max = caracteristic[name];
      }
    });
    if (min === max) {
      if (name === 'price') {
        return this.currencyPipe.transform(min);
      }
      return min;
    }
    if (name === 'price') {
      return this.currencyPipe.transform(min)
        + ' to '
        + this.currencyPipe.transform(max);
    }
    return min + ' to ' + max;
  }

  computeWeight() {
    let minWeight = Number.MAX_SAFE_INTEGER;
    let maxWeight = 0;
    if (this.characteristics === null
      || this.characteristics === undefined
      || this.characteristics.length === 0) {
      return 'bla';
    }
    this.characteristics.forEach(caracteristic => {
      if (minWeight > caracteristic.weight) {
        minWeight = caracteristic.weight;
      }
      if (maxWeight < caracteristic.weight) {
        maxWeight = caracteristic.weight;
      }
    });
    if (minWeight === maxWeight) {
      return minWeight + 'g';
    }
    return minWeight + ' to ' + maxWeight + 'g';
  }
}
