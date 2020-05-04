import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { CategoryService } from './_services/category.service';

declare var $: any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser: User;
  badgeCategory: number;
  interval;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
    // this.startTimer();
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }


  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.positionFooter();
    });
  }

  ngAfterViewInit(): void {
    this.positionFooter();
  }

  onResize(event) {
    this.positionFooter();
  }
  positionFooter() {
    $('main').css('padding-bottom', $('footer').height());
  }

  get isAdmin() {
    return this.currentUser
      && this.currentUser.roles
      && this.currentUser.roles.indexOf(Role.Admin) !== -1;
  }

  get isAmbassador() {
    const isAmbassador = this.currentUser
      && this.currentUser.roles
      && (this.currentUser.roles.indexOf(Role.Ambassador) !== -1
        || this.currentUser.roles.indexOf(Role.Admin) !== -1);
    return isAmbassador;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.isAmbassador) {
        this.categoryService.count()
          .subscribe(
            response => {
              this.badgeCategory = Number(response.headers.get('X-Total-Count'));
            }
          );
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
