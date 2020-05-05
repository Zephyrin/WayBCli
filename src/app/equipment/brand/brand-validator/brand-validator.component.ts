import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { Brand } from '@app/_models';
import { BrandService } from '@app/_services/brand.service';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';

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

  constructor(
    private brandService: BrandService,
    private router: Router,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/login']);
      }
     }

  ngOnInit() {
    this.loading = true;
    this.brandService.getAll().pipe(first()).subscribe(brands => {
      this.loading = false;
      this.brands = brands;
    });
  }

  setSelected(brand: Brand) {
    this.selected = brand;
  }

  canEditOrDelete(brand: Brand) {
    return true;
  }

}
