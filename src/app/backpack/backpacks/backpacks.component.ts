import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import { BackpackPaginationSearchService } from '@app/_services/backpack/backpack-pagination-search.service';
import { User, Backpack } from '@app/_models';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-backpacks',
  templateUrl: './backpacks.component.html',
  styleUrls: ['./backpacks.component.scss']
})
export class BackpacksComponent implements OnInit {
  @Input()
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
    this.params$ = params;
    if (this.params$.hasOwnProperty('userId')) {
      this.userId$ = this.params$[`userId`];
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
    public service: BackpackPaginationSearchService
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login?returnUrl=%2f']);
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

  canAddOrEdit() {
    return this.currentUser.id === this.service.userId;
  }

  updateClick(back: Backpack) {
    this.service.setSelected(back);
    this.router.navigate(['backpack'], { queryParams: {backpackId: back.id, userId: this.userId}});
  }

  deleteClick() {
  }

  hasBackpack(): boolean {
    return this.service && this.service.values !== undefined && this.service.values.length > 0;
  }

  displayHelp(): boolean {
    return !this.hasBackpack();
  }

  firstThingToDo(): boolean {
    return this.currentUser.haves.length === 0;
  }

  showEquipmentHelp() {
    const equipmentHelps = document.getElementsByClassName('equipmentHelps');
    Array.from(equipmentHelps).forEach(eq => {
      eq.classList.add('helpers');
    });
    setTimeout(x => {
      Array.from(equipmentHelps).forEach(eq => {
        eq.classList.remove('helpers');
      });
    }, 5000);
  }
}
