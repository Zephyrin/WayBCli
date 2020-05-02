import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import { User, Have } from '@app/_models';

declare var $: any;

@Component({
  selector: 'app-user-owned',
  templateUrl: './user-owned.component.html',
  styleUrls: ['./user-owned.component.less']
})
export class UserOwnedComponent implements OnInit {
  @ViewChild('cardFooterBody', { static: false }) cardFooterBody: ElementRef;

  @Input() footer;
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  ngOnInit() {
  }

  get countWant() {
    let want = 0;
    this.currentUser.haves.forEach(have => {
      if (have.wantQuantity > 0) {
        want += have.wantQuantity;
      }
    });
    return want;
  }

  get countOwned() {
    let own = 0;
    this.currentUser.haves.forEach(have => {
      if (have.ownQuantity > 0) {
        own += have.ownQuantity;
      }
    });
    return own;
  }

  count(name) {
    let ret = 0;
    this.currentUser.haves.forEach(have => {
      if (have.ownQuantity > 0 && have.characteristic[name] > 0) {
        ret += have.characteristic[name];
      }
    });
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
