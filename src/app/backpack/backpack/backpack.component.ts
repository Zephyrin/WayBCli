import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import { BackpackPaginationSearchService } from '@app/_services/backpack/backpack-pagination-search.service';
import { User } from '@app/_models';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.scss']
})
export class BackpackComponent implements OnInit {
  set userId(user: number) {
    this.userId$ = user;
    this.service.userId = this.userId$;
    this.init();
  }
  get userId(): number {
    return this.userId$;
  }
  private userId$: number;

  set params(params: Params) {
    this.paramsP = params;
    if (this.paramsP.hasOwnProperty('userId')) {
      this.userId$ = this.paramsP[`userId`];
    }
    this.init();
  }
  get params(): Params {
    return this.paramsP;
  }
  private paramsP: Params;

  private currentUser: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public service: BackpackPaginationSearchService
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=backpack']);
    }
    this.authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        if (this.userId === undefined) { this.userId = x.id; }
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  init() {
    if (this.userId && this.params) {
      this.service.init(this.router, this.route, this.params);
    }
  }

}
