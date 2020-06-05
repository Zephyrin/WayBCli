import { Injectable } from '@angular/core';

import { UserService } from '../user.service';

import { User, Role } from '@app/_models';
import { SortByEnum } from '@app/_enums/user.enum';

import { SortService } from '../helpers/sort.service';
import { FormErrors } from '@app/_errors';

@Injectable({
  providedIn: 'root'
})
export class UserPaginationSearchService extends SortService<User> {

  /* Search */
  public sortBy = SortByEnum.username;

  constructor(private service: UserService) {
    super(service);
  }

  getSortByEnum() {
    return SortByEnum;
  }

  getDefaultSortByEnum() {
    return SortByEnum.username;
  }

  newValue(x: any): User {
    return new User(x);
  }

  canEdit(user: User): boolean {
    return user.roles.indexOf(Role.SuperAdmin) === -1;
  }

  setSelected(user: User) {
    if (this.canEdit(user)) {
      super.setSelected(user);
    }
  }

  updateUser(user: User, role: Role) {
    if (user.roles.indexOf(role) === -1) {
      this.loading = true;
      const previousRole = user.roles;
      user.roles = [role];
      this.service.update(user).subscribe(ret => {
        this.endTransaction();
      }, error => {
        user.roles = previousRole;
        this.endTransactionError(error);
      });
    }
  }

  endTransaction() {
    this.loading = false;
  }

  endTransactionError(error) {
    this.loading = false;
    if (error) {
      this.errors.formatError(error);
    } else {
      this.errors = new FormErrors();
    }
  }
}
