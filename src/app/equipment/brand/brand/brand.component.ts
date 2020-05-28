import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Brand } from '@app/_models';
import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';

import { AuthenticationService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected service: BrandPaginationSearchService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=brands']);
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service.init(this.router, this.route, params);
    });
  }

  dblClick(brand: Brand) {
    if (this.service.canEditOrDelete(brand)) {
      this.brandModal.open(brand);
    }
  }
}
