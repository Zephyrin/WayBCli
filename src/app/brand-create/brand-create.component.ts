import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from "../shared/rest-api.service";

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.less']
})
export class BrandCreateComponent implements OnInit {
  @Input() brandDetails = { name: '', description: '', uri: '' }
  constructor(
    public restApi: RestApiService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  addBrand(dataBrand) {
    this.restApi.createBrand(this.brandDetails).subscribe((data: {}) => {
      this.router.navigate(['/brands-list'])
    })
  }

}
