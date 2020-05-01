import { ExtraFieldDef } from '@app/_models';

export class SubCategory {
  constructor(
    public id: number = 0
  , public name: string = ''
  , public extraFieldDefs: ExtraFieldDef[] = []) {
    this.extraFieldDefs = [];
   }
}
