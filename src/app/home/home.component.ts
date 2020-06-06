import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  currentUser: User;
  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.pipe(first()).subscribe(
      x => this.currentUser = x);
   }

  ngOnInit() {
  }
}
