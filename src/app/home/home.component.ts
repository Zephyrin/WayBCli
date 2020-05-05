import { Component, NgModule, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { BrowserModule } from '@angular/platform-browser';

@Component({ templateUrl: 'home.component.html' })

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ HomeComponent],
  bootstrap: [ HomeComponent ]
})
export class HomeComponent implements OnInit {
    loading = false;
    users: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = false;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }
}
