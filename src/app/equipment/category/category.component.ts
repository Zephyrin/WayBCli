import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Category } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SortEnum, SortByEnum } from '@app/_enums/category.enum';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild('categoryModal', { static: true }) categoryModal;
  @Input() isValidator = false;

  interval: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceP: CategoryPaginationSearchService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    if (window.location.pathname === '/categoriesValidator') {
      this.isValidator = true;
    }
  }

  get sortEnum() { return SortEnum; }
  get sortByEnum() { return SortByEnum; }
  get service() { return this.serviceP; }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.service.init(this.router, this.route, params, this.isValidator);
    });
  }

  setSelected(category: Category) {
    clearInterval(this.interval);
    if (this.service.selected === category) {
      this.interval = setInterval(() => {
        this.service.setSelected(undefined);
      }, 200);

    } else {
      this.service.setSelected(category);
    }
  }

  dblClick(category: Category) {
    clearInterval(this.interval);
    if (this.service.canEditOrDelete(category)) {
      this.categoryModal.open(category);
    }
  }
}
