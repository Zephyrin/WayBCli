import { SubCategory } from '@app/_models/sub-category';
import { User } from './user';

export class Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
  askValidate: boolean;
  validate: boolean;
  createdBy: User;
  constructor(cat: Category = null) {
    if (cat !== null) {
      this.id = cat.id;
      this.name = cat.name;
      this.subCategories = [];
      if (cat.subCategories !== null && cat.subCategories !== undefined) {
        cat.subCategories.forEach(sub => {
          this.subCategories.push(new SubCategory(sub));
        });
      }
      this.askValidate = cat.askValidate;
      this.validate = cat.validate;
      this.createdBy = cat.createdBy;
    }
  }
}
