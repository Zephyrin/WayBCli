import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Brand } from '@app/_models';
import { BrandService } from '@app/_services/brand.service';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.less']
})
export class BrandComponent implements OnInit {
  brandForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  brands: Brand[];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService) { }

  ngOnInit() {
    this.loading = true;
    this.brandService.getAll().pipe(first()).subscribe(brands => {
      this.loading = false;
      this.brands = brands;
    });
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      uri: ['', Validators.required]
    });
  }

  get f() { return this.brandForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }

    this.loading = true;
    this.brandService.add(this.brandForm.value);
    this.loading = false;
  }
}
