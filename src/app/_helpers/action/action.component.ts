import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';
import { Validation } from '@app/_models/validation';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() service: PaginationAndParamsService<Validation>;
  @Input() value: Validation;
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  updateClick(value: Validation) {
    this.update.emit();
  }
  deleteClick(value: Validation) {
    this.delete.emit();
  }
}
