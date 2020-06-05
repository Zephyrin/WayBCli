import { Component, OnInit, Input } from '@angular/core';
import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';

@Component({
  selector: 'app-top-errors',
  templateUrl: './top-errors.component.html',
  styleUrls: ['./top-errors.component.scss']
})
export class TopErrorsComponent implements OnInit {
  @Input() service: PaginationAndParamsService<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
