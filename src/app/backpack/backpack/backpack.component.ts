import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { BackpacksPaginationSearchService } from '@app/_services/backpack/backpacks-pagination-search.service';
import { User, Have } from '@app/_models';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.scss'],
})
export class BackpackComponent implements OnInit {
  @Input()
  set userId(id: number) {
    this.service.userId = id;
    this.userId$ = id;
    this.init();
  }
  get userId(): number {
    return this.userId$;
  }
  private userId$: number;

  @Input()
  set backpackId(backpackId: number) {
    this.backpackId$ = backpackId;
    this.init();
  }
  get backpackId(): number {
    return this.backpackId$;
  }
  private backpackId$: number;

  set params(params: Params) {
    this.params$ = params;

    if (this.params$.hasOwnProperty('userId')) {
      this.userId$ = this.params$[`userId`];
    }
    if (this.params$.hasOwnProperty('backpackId')) {
      this.backpackId$ = this.params$[`backpackId`];
    }
    this.init();
  }

  get params(): Params {
    return this.params$;
  }
  private params$: Params;

  public currentUser: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public service: BackpacksPaginationSearchService,
    public userService: UserService
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=backpack']);
    }
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = new User(x);
      if (this.userId === undefined) {
        this.userId = x.id;
      }
      this.service.user = this.currentUser;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
  }

  init() {
    if (this.userId && this.backpackId && this.params) {
      this.service.initSelected(this.backpackId);
    }
  }
}
