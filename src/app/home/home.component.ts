import { Component, NgModule, OnInit } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { Backpack } from '@app/_models/backpack';
import { AuthenticationService } from '@app/_services';
import { BackpackService } from '@app/_services/backpack.service';
import { User } from '@app/_models';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'home.component.html' })

@NgModule({
  imports: [BrowserModule],
  declarations: [HomeComponent],
/*   bootstrap: [HomeComponent] */
})
export class HomeComponent implements OnInit {
  loading = false;
  currentUser: User;
  backpacks: Backpack[];
  constructor(
    private authenticationService: AuthenticationService,
    private backpackService: BackpackService
  ) {
    this.authenticationService.currentUser.pipe(first()).subscribe(
      x => this.currentUser = x);
   }

  ngOnInit() {
    this.loading = false;
    this.backpackService.getAll(this.currentUser)
      .subscribe(backpacks => {
        this.backpacks = backpacks;
        this.loading = false;
      });
  }
}
