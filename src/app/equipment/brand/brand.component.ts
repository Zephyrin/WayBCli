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
  deleteError = '';
  deleteHasError = false;
  brands: Brand[];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService) { }

  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.brandService.getAll().pipe(first()).subscribe(brands => {
      this.loading = false;
      this.brands = brands;
    });
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      uri: ['', Validators.required],
      message: ['']
    });
  }

  get f() { return this.brandForm.controls; }

  onSubmit() {
    this.deleteHasError = false;
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }
    this.loading = true;
    this.brandService.add(this.brandForm.value).subscribe(brand =>{
      this.loading = false;
      this.submitted = false;
      this.brands.push(brand);

    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

  deleteBrand(brand: Brand) {
    var index = this.brands.indexOf(brand);
    this.brands.splice(index, 1);
    this.loading = false;
  }

  onDelete(brand: Brand) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.brandService.delete(brand).subscribe(next => {
      this.deleteBrand(brand);
    }, error => {
      if (error.status === 404) {
        this.deleteBrand(brand);
      } else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }
}
