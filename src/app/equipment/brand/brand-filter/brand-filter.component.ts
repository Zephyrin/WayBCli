import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

import { Brand } from '@app/_models';

@Component({
  selector: 'app-brand-filter',
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.scss']
})
export class BrandFilterComponent implements OnInit {
  @Output() filterDone = new EventEmitter<Brand[]>();

  private brandP: Brand[];

  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnURL=brands']);
    }
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
    this.route.paramMap.subscribe(params => {
      console.log(params);
    });
  }

}
