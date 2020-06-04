import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './_services';
import { User, Role } from './_models';

declare var $: any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser: User;
  badgeCategory: number;
  interval;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService
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

    $(document).on('hidden.bs.modal', '.modal', () => {
      if ($('.modal:visible').length) { $(document.body).addClass('modal-open'); }
    });

    $(document).on('show.bs.modal', '.modal', function () {
      const zIndex = 1040 + (10 * $('.modal:visible').length);
      $(this).css('z-index', zIndex);
      setTimeout(() => {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      }, 0);
    });

  }

  ngAfterViewInit(): void {
    this.positionFooter();
  }

  onResize(event) {
    this.positionFooter();
  }

  positionFooter() {
    const height = $('footer').height() + 10;
    const bdSidebarList = document.getElementsByClassName('bd-sidebar');
    Array.from(bdSidebarList).forEach(element => {
      this.paddingBottomImportant(element as HTMLElement, height);
    });
    const bdMainList = document.getElementsByTagName('main');
    Array.from(bdMainList).forEach(element => {
      this.paddingBottomImportant(element as HTMLElement, height);
    });
  }

  private paddingBottomImportant(element: HTMLElement, height: number) {
    (element as HTMLElement).style.setProperty('padding-bottom', height + 'px', 'important');
  }

  get pathname() {
    return window.location.pathname;
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
        || this.currentUser.roles.indexOf(Role.Admin) !== -1
        || this.currentUser.roles.indexOf(Role.SuperAdmin) !== -1);
    return isAmbassador;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
