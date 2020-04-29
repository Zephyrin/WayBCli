export class Errors {
  errors: [];
  has: boolean;
  constructor(errors: []) {
    this.errors = errors;
    this.has = (this.errors !== undefined);
  }

  add(errors: []) {
    if (this.has) {
      if (errors !== undefined) {
        errors.forEach(value => {
          this.errors.push(value);
        });
      }
    }
    this.has = this.errors !== undefined;
  }
}
export class FormErrors {
  errors: Errors[];
  hasErrors: boolean[];
  message: string;
  hasMessage: boolean;
  fatalError: string;
  hasFatalError: boolean;

  constructor() {
    this.errors = [];
    this.hasErrors = [];
    this.hasMessage = this.hasFatalError = false;
  }

  formatError(error) {
    this.message = error.error.Message;
    this.hasMessage = this.message !== undefined;
    this.errors = [];
    this.hasErrors = [];
    if (error.status === 500) {
      this.hasFatalError = true;
      this.fatalError = '... :S Internal server error.<br /><br/>'
        + 'We will take a look very soon.'
        + 'You can try again in some hours.<br/><br/>'
        + 'If it will still show this error consider to sent an email to:<br/>'
        + 'damortien@gmail.com';
    } else {
      this.hasFatalError = false;
      this.fatalError = undefined;
      error.error.errors.forEach(element => {
        Object.keys(element.children).forEach(key => {
          if (this.errors[key] === undefined) {
            this.errors[key] = new Errors(element.children[key].errors);
          } else {
            this.errors[key].add(element.children[key].errors);
          }
        });
      });
      Object.keys(this.errors).forEach(key => {
        this.hasErrors[key] = this.errors[key].has;
      });
    }
  }
}
