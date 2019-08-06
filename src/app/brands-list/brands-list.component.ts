import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../shared/rest-api.service";

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.less']
})
export class BrandsListComponent implements OnInit {

  Brand: any = [];

  constructor(
    public restApi: RestApiService
  ) { }

  ngOnInit() {
    this.loadBrands()
  }

  // Get brands list
  loadBrands() {
    return this.restApi.getBrands().subscribe((data: {}) => {
      this.Brand = data;
    })
  }

  // Delete brand
  deleteBrand(id) {
    if (window.confirm('Are you sure, you want to delete?')){
      this.restApi.deleteBrand(id).subscribe(data => {
        this.loadBrands()
      })
    }
  }  

}