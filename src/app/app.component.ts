import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',  
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(
          x => this.currentUser = x);
    }

    get isAdmin() {
      return this.currentUser 
        && this.currentUser.roles
        && this.currentUser.roles.indexOf(Role.Admin) !== -1;
    }

    get isAmbassador() {
        return this.currentUser
        && this.currentUser.roles
        && (this.currentUser.roles.indexOf(Role.Ambassador) !== -1
          || this.currentUser.roles.indexOf(Role.Admin) !== -1);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    login() {
        this.router.navigate(['/login']);
    }
}
