import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

import { BooleanEnum } from '@app/_enums/boolean.enum';
import { CategoryPaginationSearchService } from '../../../_services/category/category-pagination-search.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  @ViewChild('searchText', { static: false }) searchText: ElementRef;
  @ViewChild('askValidationBtn', { static: false }) askValidationBtn: ElementRef;
  @Input() isCombo = false;
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private serviceP: CategoryPaginationSearchService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnURL=brands']);
    }
  }

  get service() { return this.serviceP; }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: [this.service.search]
    });
  }

  get booleanEnum() { return BooleanEnum; }

  search() {
    const text = this.searchText.nativeElement.value.toLocaleLowerCase();
    this.service.setSearch(text);
  }

  changeAskValidation() {
    this.service.filterAskValidate();
  }

  changeValidate() {
    this.service.filterValidate();
  }
}
