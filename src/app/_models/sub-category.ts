import { User } from './user';
import { BooleanEnum } from '@app/_enums/boolean.enum';

export class SubCategory {
  id = 0;
  name = '';
  validate = false;
  askValidate = false;
  createdBy: User;
  inFilter = BooleanEnum.undefined;
  constructor(sub: SubCategory = null) {
    if (sub !== null && sub !== undefined) {
      this.id = sub.id;
      this.name = sub.name;
      this.validate = sub.validate;
      this.askValidate = sub.askValidate;
      this.createdBy = sub.createdBy;
    }
  }
}
