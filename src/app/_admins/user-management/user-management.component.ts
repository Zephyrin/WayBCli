import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

import { UserPaginationSearchService } from '@app/_services/user/user-pagination-search.service';
import { SortByEnum } from '@app/_enums/user.enum';
import { SortEnum } from '@app/_enums/boolean.enum';
import { User, Role } from '@app/_models';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: UserPaginationSearchService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=usersManagement']);
    }
  }

  get sortEnum() { return SortEnum; }
  get sortByEnum() { return SortByEnum; }
  get role() { return Role; }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service.init(this.router, this.route, params);
    });
  }
}
