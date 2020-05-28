import { Component, OnInit, Input } from '@angular/core';

import { PaginationAndParamsService } from '@app/_services/helpers/pagination-and-params.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() pagination: PaginationAndParamsService;
  constructor() { }

  ngOnInit(): void {
  }

}
