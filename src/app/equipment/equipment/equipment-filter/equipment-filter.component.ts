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
    private serviceP: EquipmentPaginationSearchService,
    private categoryServiceP: CategoryPaginationSearchService) { }

  get service() { return this.serviceP; }
  get categoryService() { return this.categoryServiceP; }
  get booleanEnum() { return BooleanEnum; }

  ngOnInit(): void {
    // TODO Use Observable to init this array.
    this.categoryService.initWithParams(undefined, undefined, undefined, undefined, '0', undefined)
      .subscribe(
        response => {
          this.serviceP.categories = response.body.map(x => new Category(x));
          this.serviceP.initBelongToSub(undefined);
        }
      );
    this.categoryService.isValidator = false;
  }

  prevent(event) {
    event.stopPropagation();
  }
}
