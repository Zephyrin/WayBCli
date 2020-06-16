import { FormErrors } from '@app/_errors/form-error';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-errors',
  templateUrl: './top-errors.component.html',
  styleUrls: ['./top-errors.component.scss']
})
export class TopErrorsComponent implements OnInit {
  @Input() errors: FormErrors;
  constructor() { }

  ngOnInit(): void {
  }

}
