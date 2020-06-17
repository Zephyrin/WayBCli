import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Brand } from '@app/_models';
import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';

import { AuthenticationService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { SortByEnum } from '@app/_enums/brand.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;
  @Input() isValidator = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceP: BrandPaginationSearchService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=brands']);
    }
    if (window.location.pathname === '/brandsValidator') {
      this.isValidator = true;
    }
  }

  get sortByEnum() { return SortByEnum; }
  get service() { return this.serviceP; }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service.isValidator = this.isValidator;
      this.service.noPagination = BooleanEnum.undefined;
      this.service.init(this.router, this.route, params);
    });
  }

  dblClick(brand: Brand) {
    if (this.service.canEditOrDelete(brand)) {
      this.brandModal.open(brand);
    }
  }
}
