import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EquipmentService } from '@app/_services/equipment.service';
import { Equipment } from '@app/_models/equipment';

import { CategoryService } from '@app/_services/category.service';
import { Category } from '@app/_models/category';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { SubCategory } from '@app/_models';

declare var $: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {
  @ViewChild('modal', {static: true}) modal;

  equipments: Equipment[];
  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  categoryForm: FormGroup;
  categories: Category[];
  selectedCategory: Category = null;

  selectedSubCategory: SubCategory = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: EquipmentService,
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/login']);
      }
    }

  get f() { return this.form.controls; }

  hasError(name) {
    return this.submitted
      && (this.form.controls[name].errors
         || this.errors.hasErrors[name]);
  }

  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.service.getAll()
      .pipe(first())
      .subscribe(equipments => {
        this.loading = false;
        this.equipments = equipments;
    });

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      brand: [null],
      subCategory: [null, Validators.required],
      extraFields: [[]]
    });
    this.categoryForm = this.formBuilder.group({
      category: [null, Validators.required]
    });
  }

  setSelected(selected: Equipment) {
    if (selected === this.selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
    }
  }

  onCategoryChange() {
    this.selectedCategory = this.categoryForm.get('category').value;
  }

  onSubCategoryChange() {
    this.selectedSubCategory = this.form.get('subCategory').value;
  }

  update() {
    this.update_category();
    this.form.reset(new Equipment());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.update_category();
    this.selected = new Equipment();
    this.form.reset(this.selected);
    this.isCreateForm = true;
  }

  update_category() {
    this.loading = true;
    this.categoryService.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.loading = false;
        this.categories = categories;
      });
  }

  compareByID(itemOne, itemTwo) {
    if (itemOne === null && itemTwo === null) {
      return true;
    }
    return itemOne && itemTwo && itemOne.id === itemTwo.id;
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  onSubmit() {
    this.manageDeleteError(undefined);
    this.errors = new FormErrors();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const subCategory = this.form.value.subCategory;
    this.form.value.subCategory = subCategory.id;
    if (this.isCreateForm) {
      this.service.create(this.form.value)
        .subscribe(equipment => {
          this.endTransaction();
          this.form.value.subCategory = subCategory;
          this.equipments.push(equipment);
      }, (error: any) => {
        this.form.value.subCategory = subCategory;
        this.endTransactionError(error);
      });
    } else {
      this.service.update(this.form.value)
        .subscribe(returnValue => {
          this.form.value.subCategory = subCategory;
          this.endTransaction();
          Object.assign(this.selected, this.form.value);
        }, (error: any) => {
          this.form.value.subCategory = subCategory;
          this.endTransactionError(error);
        });
    }
  }

  onCancel() {
    this.errors = new FormErrors();
    if (this.selected === undefined
        || this.selected.id === undefined
        || this.selected.id === 0) {
      this.selected = null;
    }
  }

  delete(deleteValue: Equipment) {
    const index = this.equipments.indexOf(deleteValue);
    this.equipments.splice(index, 1);
    this.loading = false;
    this.manageDeleteError(undefined);
    this.selected = null;
  }

  onDelete(deleteValue: Equipment) {
    this.loading = true;
    this.manageDeleteError(undefined);
    this.service.delete(deleteValue).subscribe(next => {
      this.delete(deleteValue);
      this.endTransaction();
    }, error => {
      if (error.status === 404) {
        this.delete(deleteValue);
      } else {
        this.manageDeleteError(error.message);
      }
      this.endTransaction();
    });
  }

  manageDeleteError(message: string) {
    this.deleteError = message;
    this.deleteHasError = message !== undefined;
  }

  endTransaction() {
    this.loading = false;
    this.submitted = false;
    $(this.modal.nativeElement).modal('hide');
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }
}
