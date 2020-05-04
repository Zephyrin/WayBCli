import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { Brand } from '@app/_models';
import { BrandService } from '@app/_services/brand.service';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';

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

  constructor(
    private brandService: BrandService) { }

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
