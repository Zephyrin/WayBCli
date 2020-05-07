export class SubCategory {
  id = 0;
  name = '';
  validate = false;
  askValidate = false;

  constructor(sub: SubCategory = null) {
    if (sub !== null && sub !== undefined) {
      this.id = sub.id;
      this.name = sub.name;
      this.validate = sub.validate;
      this.askValidate = sub.askValidate;
    }
  }
}
