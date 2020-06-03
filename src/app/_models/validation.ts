export class Validation {
  validate: boolean;
  askValidate: boolean;

  constructor(v: Validation) {
    if (v) {
      this.validate = v.validate;
      this.askValidate = v.askValidate;
    }
  }
}
