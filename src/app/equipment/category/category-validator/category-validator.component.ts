import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild, SimpleChange } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CategoryService } from '@app/_services/category.service';
import { Category } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';

@Component({
  selector: 'app-category-validator',
  templateUrl: './category-validator.component.html',
  styleUrls: ['./category-validator.component.less']
})
export class CategoryValidatorComponent implements OnInit {

  @ViewChild('categoryModal', { static: true }) categoryModal;

  categories: Category[];
  loading = false;
  selected = undefined;
  interval: any;
  errors = new FormErrors();

  constructor(
    private router: Router,
    private service: CategoryService,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.service.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.categories = categories;
        this.loading = false;
      });
  }

  setSelected(category: Category) {
    clearInterval(this.interval);
    if (this.selected === category) {
      this.interval = setInterval(() => {
        this.selected = undefined;
      }, 200);

    } else {
      this.selected = category;
    }
  }

  dblClick(category: Category) {
    clearInterval(this.interval);
    if (this.canEditOrDelete(category)) {
      this.categoryModal.open(category);
    }
  }

  canEditOrDelete(category: Category) {
    return category.askValidate || category.validate;
  }

  onUpdateDone(simple: SimpleChange) {
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.categories.push(simple.currentValue);
        } else if (simple.currentValue === null) {
          const index = this.categories.indexOf(simple.previousValue);
          if (index > 0) {
            this.categories.splice(index, 1);
          }
        } else {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        this.cd.detectChanges();
      }
    });
  }

  updateValidate(category: Category) {
    this.errors = new FormErrors();
    this.setSelected(category);
    this.loading = true;
    category.validate = !category.validate;
    this.service.update(category)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        category.validate = !category.validate;
        this.loading = false;
      });
  }
}

