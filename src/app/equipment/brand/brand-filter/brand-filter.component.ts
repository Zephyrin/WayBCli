import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';
import { BooleanEnum } from '@app/_enums/brand.enum';

@Component({
  selector: 'app-brand-filter',
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.scss']
})
export class BrandFilterComponent implements OnInit {
  @ViewChild('searchText', { static: false }) searchText: ElementRef;
  @ViewChild('askValidationBtn', { static: false }) askValidationBtn: ElementRef;
  @Input() service: BrandPaginationSearchService;

  searchForm: FormGroup;

  private serviceP: BrandPaginationSearchService;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnURL=brands']);
    }
  }

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
