export class ExtraFieldDef {
  constructor(
      public id: number = 0
    , public name: string = ''
    , public type: string = ''
    , public isPrice: boolean = false
    , public isWeight: boolean = false
    , public linkTo: ExtraFieldDef = null) {
  }
}
