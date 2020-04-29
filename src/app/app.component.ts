import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { CategoryService } from './_services/category.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User;
  badgeCategory: number;
  interval;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private categoryService: CategoryService
  ) {
      this.authenticationService.currentUser.subscribe(
        x => this.currentUser = x);
      this.startTimer();
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
