import { Component, OnInit, Input } from '@angular/core';
import { SortService } from '@app/_services/helpers/sort.service';
import { SortEnum } from '@app/_enums/boolean.enum';

@Component({
  selector: 'app-thead',
  templateUrl: './thead.component.html',
  styleUrls: ['./thead.component.scss']
})
export class TheadComponent<T> implements OnInit {
  @Input() service: SortService<T>;
  @Input() text: string;
  @Input() sortBy: any;

  constructor() { }

  ngOnInit(): void {
  }

  get sortEnum() { return SortEnum; }
}
