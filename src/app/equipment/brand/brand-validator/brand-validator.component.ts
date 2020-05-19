import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { Brand, User } from '@app/_models';
import { BrandService } from '@app/_services/brand.service';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { FormErrors } from '@app/_errors';

@Component({
  selector: 'app-brand-validator',
  templateUrl: './brand-validator.component.html',
  styleUrls: ['./brand-validator.component.less']
})
export class BrandValidatorComponent implements OnInit {
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;
  loading = false;
  brands: Brand[];
  selected: Brand;
  errors: FormErrors;
  currentUser: User;

  constructor(
    private brandService: BrandService,
    private router: Router,
    private service: BrandService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  ngOnInit() {
    this.loading = true;
    this.errors = new FormErrors();
    this.brandService.getAll().pipe(first()).subscribe(brands => {
      this.loading = false;
      this.brands = brands.filter(x => x.validate || x.askValidate
        || x.createdBy.id === this.currentUser.id);
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
    return brand.validate || brand.askValidate;
  }

  dblClick(brand: Brand) {
    if (this.canEditOrDelete(brand)) {
      this.brandModal.open(brand);
    }
  }

  updateValidate(brand: Brand) {
    this.errors = new FormErrors();
    this.setSelected(brand);
    this.loading = true;
    brand.validate = !brand.validate;
    this.service.update(brand)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        brand.validate = !brand.validate;
        this.loading = false;
      });
  }
}
