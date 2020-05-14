import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { User, Have } from '@app/_models';
import { HaveService } from '@app/_services/have.service';

declare var $: any;

@Component({
  selector: 'app-user-owned',
  templateUrl: './user-owned.component.html',
  styleUrls: ['./user-owned.component.scss']
})
export class UserOwnedComponent implements OnInit {
  @ViewChild('cardFooterBody', { static: false }) cardFooterBody: ElementRef;

  @Input() footer;
  currentUser: User;
  loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private haveService: HaveService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  ngOnInit() {
    if (this.currentUser.id !== undefined) {
      this.loading = true;
      this.haveService.getAll(this.currentUser.id)
        .pipe(first())
        .subscribe(haves => {
          this.loading = false;
          this.currentUser.haves = haves;
        });
    }
  }

  get countWant() {
    let want = 0;
    if (this.currentUser && this.currentUser.haves) {
      this.currentUser.haves.forEach(have => {
        if (have.wantQuantity > 0) {
          want += have.wantQuantity;
        }
      });
    }
    return want;
  }

  get countOwned() {
    let own = 0;
    if (this.currentUser && this.currentUser.haves) {
      this.currentUser.haves.forEach(have => {
        if (have.ownQuantity > 0) {
          own += have.ownQuantity;
        }
      });
    }
    return own;
  }

  count(name) {
    let ret = 0;
    if (this.currentUser && this.currentUser.haves) {
      this.currentUser.haves.forEach(have => {
        if (have.characteristic !== undefined
          && have.characteristic !== null
          && have.ownQuantity > 0 && have.characteristic[name] > 0) {
          ret += have.characteristic[name] * have.ownQuantity;
        }
      });
    }
    return ret;
  }

  toggleCard() {
    const elt = $(this.cardFooterBody.nativeElement);
    if (elt.hasClass('show')) {
      elt.collapse('hide');
    } else {
      elt.collapse('show');
    }
  }
}
