﻿import { Component, NgModule } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { BrandComponent } from '@app/equipment/brand/brand.component';
import { BrowserModule } from '@angular/platform-browser';

@Component({ templateUrl: 'home.component.html' })

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ HomeComponent, BrandComponent],
  bootstrap: [ HomeComponent ]
})
export class HomeComponent {
    loading = false;
    users: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }
}
