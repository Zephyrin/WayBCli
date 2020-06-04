import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { Equipment, User } from '@app/_models';
import { Category, SubCategory } from '@app/_models';

import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';
import { EquipmentPaginationSearchService } from '@app/_services/equipment/equipment-pagination-search.service';
import { BooleanEnum } from '@app/_enums/boolean.enum';

@Component({
  selector: 'app-equipment-filter',
  templateUrl: './equipment-filter.component.html',
  styleUrls: ['./equipment-filter.component.scss']
})
export class EquipmentFilterComponent implements OnInit {
  @ViewChild('ownedBtn', { static: false }) ownedBtn: ElementRef;
  @ViewChild('wishesBtn', { static: false }) wishesBtn: ElementRef;
  @ViewChild('othersBtn', { static: false }) othersBtn: ElementRef;
  @ViewChild('searchText', { static: false }) searchText: ElementRef;

  equipmentsFilter: Equipment[];
  filterSubCategories: SubCategory[] = [];

  currentUser: User;

  constructor(
    private serviceP: EquipmentPaginationSearchService) { }

  get service() { return this.serviceP; }
  get booleanEnum() { return BooleanEnum; }

  ngOnInit(): void {
  }

  prevent(event) {
    event.stopPropagation();
  }
}
