import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { RegisterService } from '@app/_services';
import { EnumGender } from '@app/_enums';
import { isUndefined } from 'util';
import { FormErrors } from '@app/_errors';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  genderKeys: any[];
  genders = EnumGender;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errors = new FormErrors();

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private registerService: RegisterService
  ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
      }

  }

  ngOnInit() {
    this.genderKeys = Object.keys(this.genders).filter(Number);
    this.registerForm = this.formBuilder.group({
        gender: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.registerForm.value.gender = this.genders[this.registerForm.value.gender].toUpperCase();
    this.registerService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.authenticationService.registerLogin(data);
          this.router.navigate(['/']);
        },
        error => {
          this.errors.formatError(error);
          this.loading = false;
        });
  }
}
