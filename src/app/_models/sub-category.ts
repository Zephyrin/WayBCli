export class SubCategory {
  id = 0;
  name = '';

  constructor(sub: SubCategory = null) {
    if (sub !== null && sub !== undefined) {
      this.id = sub.id;
      this.name = sub.name;
    }
  }
}
