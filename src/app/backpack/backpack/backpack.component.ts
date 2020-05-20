import { Component, OnInit } from '@angular/core';

import { Backpack } from '@app/_models/backpack';
import { AuthenticationService } from '@app/_services';
import { BackpackService } from '@app/_services/backpack.service';
import { User } from '@app/_models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.scss']
})
export class BackpackComponent implements OnInit {
  loading = false;
  currentUser: User;
  backpacks: Backpack[];
  constructor(
    private authenticationService: AuthenticationService,
    private backpackService: BackpackService
  ) {

  }
  ngOnInit(): void {

    this.loading = false;
    this.authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.backpackService.getAll(this.currentUser)
          .subscribe(backpacks => {
            this.backpacks = backpacks;
            this.loading = false;
          });
      });
  }

}
