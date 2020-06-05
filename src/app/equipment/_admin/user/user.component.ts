import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '@app/_services/user.service';
import { User } from '@app/_models/user';
import { AuthenticationService } from '@app/_services/authentication.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('updateUser', {static: true}) updateUser;

  userForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  deleteError = '';
  deleteHasError = false;
  users: User[];
  selectedUser: User;
  formError = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
     }

  setSelectedUser(user: User) {
    if (user === this.selectedUser) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }

  get isSelectedUser() {
    return this.selectedUser == null;
  }

  editUser() {
    this.userForm.patchValue(this.selectedUser);
  }
  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.userService.getAll(null)
      .pipe(first())
      .subscribe(users => {
        this.loading = false;
        this.users = users.body;
    });
    this.userForm = this.formBuilder.group({
      id: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      enabled: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.deleteHasError = false;
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.update(this.userForm.value).subscribe(user => {
      this.loading = false;
      this.submitted = false;
      this.formError = {};
      Object.assign(this.selectedUser, this.userForm.value);
      $(this.updateUser.nativeElement).modal('hide');
    }, (error: any) => {
      this.formError = {};
      // get the nested errors
      /* let errorData = error.json().errors.children; */
      const errorData = error.error.errors[0].children;
      // iterate the keys in errors
      for (const key in errorData) {
        // if key has nested "errors", get and set the error message, else set null
        if (errorData[key].errors) {
          this.formError[key] = errorData[key].errors;
        } else {
          this.formError[key] = null;
        }
      }
      this.error = error;
      this.loading = false;
    });
  }

  onCancel() {
    this.formError = {};
  }

  deleteUser(user: User) {
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
    this.loading = false;
  }
  onDelete(user: User) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.userService.delete(user).subscribe(next => {
      this.deleteUser(user);
    }, error => {
      if (error.status === 404) {
        this.deleteUser(user);
      } else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }

  clearError(key) {
    this.formError[key] = null;
  }
}
