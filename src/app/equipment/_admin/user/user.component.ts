import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '@app/_services/user.service';
import { User } from '@app/_models/user';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  deleteError = '';
  deleteHasError = false;
  users: User[];
  selectedUser = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/'])
      }
     }
  
  setSelectedUser(user){
    if (user == this.selectedUser){
      this.selectedUser = null;
    }
    else
      this.selectedUser = user;
  }

  get isSelectedUser(){
    return this.selectedUser == null;
  }

  editUser(){
    this.userForm.patchValue(this.selectedUser);
  }
  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.userService.getAll()
      .pipe(first())
      .subscribe(users => {
        this.loading = false;
        this.users = users;
    });
    this.userForm = this.formBuilder.group({
      id: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      enabled: ['', Validators.required],
      message: ['']
    });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.deleteHasError = false;
    this.submitted = true;
    if (this.userForm.invalid) {
      console.log(this.userForm.status);
      return;
    }
    this.loading = true;
    console.log(this.userForm.value);
    this.userService.update(this.userForm.value).subscribe(user =>{
      this.loading = false;
      this.submitted = false;
      this.selectedUser = this.userForm.value;
    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

  deleteUser(user: User) {
    var index = this.users.indexOf(user);
    this.users.splice(index, 1);
    this.loading = false;
  }
  onDelete(user: User) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.userService.delete(user).subscribe(next => {
      this.deleteUser(user);
    },error => {
      if(error.status == 404) {
        this.deleteUser(user);
      }
      else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }
}
