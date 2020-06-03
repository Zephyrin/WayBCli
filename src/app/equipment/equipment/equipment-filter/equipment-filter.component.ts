import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Equipment, User } from '@app/_models';
import { Category, SubCategory } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';
import { EquipmentPaginationSearchService } from '@app/_services/equipment/equipment-pagination-search.service';

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

  ngOnInit(): void {

    this.categoryService.initWithParams(undefined, undefined, undefined, undefined, '0', undefined);
    this.categoryService.isValidator = false;
  }

  prevent(event) {
    event.stopPropagation();
  }

  compareByID(itemOne, itemTwo) {
    if (itemOne === null && itemTwo === null) {
      return true;
    }
    return itemOne && itemTwo && itemOne.id === itemTwo.id;
  }
}
