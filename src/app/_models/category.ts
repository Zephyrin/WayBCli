import { SubCategory } from '@app/_models/sub-category';
import { User } from './user';
import { Validation } from './validation';

export class Category extends Validation {
  id: number;
  name: string;
  subCategories: SubCategory[];
  createdBy: User;
  constructor(cat: Category = null) {
    super(cat);
    if (cat !== null) {
      this.id = cat.id;
      this.name = cat.name;
      this.subCategories = [];
      if (cat.subCategories !== null && cat.subCategories !== undefined) {
        cat.subCategories.forEach(sub => {
          this.subCategories.push(new SubCategory(sub));
        });
      }
      this.createdBy = cat.createdBy;
    }
  }
}
