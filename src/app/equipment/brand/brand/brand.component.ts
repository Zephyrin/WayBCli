import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { Brand } from '@app/_models';
import { BrandService } from '@app/_services/brand.service';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { FormErrors } from '@app/_errors';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.less']
})
export class BrandComponent implements OnInit {
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;
  loading = false;
  brands: Brand[];
  selected: Brand;
  errors: FormErrors;

  constructor(
    private brandService: BrandService,
    private router: Router,
    private service: BrandService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loading = true;
    this.errors = new FormErrors();
    this.brandService.getAll().pipe(first()).subscribe(brands => {
      this.loading = false;
      this.brands = brands;
    });
  }
  returnUrl(uri: string) {
    return /^http(s)?:\/\//.test(uri) ? uri : 'https://' + uri;
  }
  setSelected(brand: Brand) {
    if (!this.loading) {
      if (this.selected !== brand) {
        this.selected = brand;
        this.errors = new FormErrors();
      }
    }
  }

  canEditOrDelete(brand: Brand) {
    return !brand.validate;
  }

  dblClick(brand: Brand) {
    if (this.canEditOrDelete(brand)) {
      this.brandModal.open(brand);
    }
  }
  updateAskValidate(brand: Brand) {
    this.errors = new FormErrors();
    this.setSelected(brand);
    this.loading = true;
    brand.askValidate = !brand.askValidate;
    this.service.update(brand)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        brand.askValidate = !brand.askValidate;
        this.loading = false;
      });
  }
}
