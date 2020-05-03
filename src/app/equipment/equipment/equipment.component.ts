import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EquipmentService } from '@app/_services/equipment.service';
import { Equipment } from '@app/_models/equipment';

import { CategoryService } from '@app/_services/category.service';
import { Category } from '@app/_models/category';
import { User, Role } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { SubCategory, Characteristic } from '@app/_models';
import { UserOwnedUpdateComponent } from '../user-owned-update/user-owned-update.component';

declare var $: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('categoryPopup', { static: true }) categoryPopup;
  @ViewChild('searchText', { static: false }) searchText: ElementRef;

  @ViewChild('ownedBtn', { static: false }) ownedBtn: ElementRef;
  @ViewChild('wishesBtn', { static: false }) wishesBtn: ElementRef;
  @ViewChild('othersBtn', { static: false }) othersBtn: ElementRef;

  @ViewChild('haveOwnedModal', { static: false }) haveOwnedModal: ElementRef<UserOwnedUpdateComponent>;

  equipments: Equipment[];
  equipmentsFilter: Equipment[];
  form: FormGroup;
  searchForm: FormGroup;
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
  haveEquipment: Equipment = null;

  currentUser: User;

  filterSubCategories: SubCategory[] = [];

  haveForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: EquipmentService,
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  get isAmbassador() {
    const isAmbassador = this.currentUser
      && this.currentUser.roles
      && (this.currentUser.roles.indexOf(Role.Ambassador) !== -1
        || this.currentUser.roles.indexOf(Role.Admin) !== -1);
    return isAmbassador;
  }

  canEditOrDelete() {
    return this.selected
      && this.selected.id !== undefined
      && (this.selected.validate === false
        || (this.selected.validate === true && this.isAmbassador));
  }
  get f() { return this.form.controls; }

  hasError(name) {
    return this.submitted
      && (this.form.controls[name].errors
        || this.errors.hasErrors[name]);
  }

  ngOnInit() {
    this.loading = true;
    let done = false;
    this.deleteHasError = false;
    this.service.getAll()
      .pipe(first())
      .subscribe(equipments => {
        this.loading = false;
        this.equipments = equipments;
        if (done) {
          this.filters();
        } else {
          done = true;
        }
      });

    this.categoryService.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.categories = categories;
        this.categories.forEach(categorie => {
          categorie.subCategories.forEach(sub => {
            this.filterSubCategories.push(sub);
          });
        });
        if (done) {
          this.filters();
        } else {
          done = true;
        }
      });
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      // brand: [null],
      subCategory: [null, Validators.required],
      characteristics: [[]]
    });
    this.categoryForm = this.formBuilder.group({
      category: [null, Validators.required]
    });
    this.searchForm = this.formBuilder.group({
      search: ['']
    });

    this.haveForm = this.formBuilder.group({
      wantQuantity: [0, Validators.required],
      ownQuantity: [0, Validators.required],
      characteristic: [null, Validators.required],
      equipment: [null, Validators.required]
    });
  }
  prevent(event) {
    event.stopPropagation();
  }

  addToHave(equipment: Equipment) {
    this.haveEquipment = equipment;
  }

  removeToHave(equipment) {

  }

  applyFilterCategory(category) {
    category.subCategories.forEach(sub => {
      const dropName = '#dropSub_' + category.id + '_' + sub.id;
      $(dropName).prop('checked', !$(dropName).prop('checked'));
      this.applyFilterSubCategory(sub);
    });
  }

  applyFilterSubCategory(subCategory) {
    const index = this.filterSubCategories.indexOf(subCategory);
    if (index >= 0) {
      this.filterSubCategories.splice(index, 1);
    } else {
      this.filterSubCategories.push(subCategory);
    }
    if (this.filterSubCategories.length === 0) {
      this.categories.forEach(cat => {
        cat.subCategories.forEach(sub => {
          const dropName = '#dropSub_' + cat.id + '_' + sub.id;
          $(dropName).prop('checked', true);
          this.filterSubCategories.push(sub);
        });
      });
    }
    this.filters();
  }

  filters(fromBtnOwned = false, fromBtnWant = false, fromBtnOther = false) {
    const text = this.searchText.nativeElement.value.toLocaleLowerCase();
    let owned = $(this.ownedBtn.nativeElement).prop('checked');
    let want = $(this.wishesBtn.nativeElement).prop('checked');
    let other = $(this.othersBtn.nativeElement).prop('checked');
    if (fromBtnOwned) {
      owned = !owned;
    } else if (fromBtnWant) {
      want = !want;
    } else if (fromBtnOther) {
      other = !other;
    }
    this.equipmentsFilter = this.equipments.filter(
      (equipment) => this.filterSubCategories.some(
        sub => sub.id === equipment.subCategory.id
          && (equipment.name.toLocaleLowerCase().includes(text)
            || equipment.description.toLocaleLowerCase().includes(text))
          && (
            (owned && this.currentUser.haves.some(
              ue => ue.ownQuantity > 0
                && ue.equipment.id === equipment.id)
            )
            || (want && this.currentUser.haves.some(
              ue => ue.wantQuantity > 0
                && ue.equipment.id === equipment.id)
            )
            ||
            (other && !this.currentUser.haves.some(
              ue => !(ue.wantQuantity <= 0 && ue.ownQuantity <= 0) && ue.equipment.id === equipment.id)
            )
          )
      )
    );
  }

  clearFilters() {
    this.filterSubCategories = [];
    this.categories.forEach(cat => {
      cat.subCategories.forEach(sub => {
        const dropName = '#dropSub_' + cat.id + '_' + sub.id;
        $(dropName).prop('checked', true);
        this.filterSubCategories.push(sub);
      });
    });
    this.searchText.nativeElement.value = '';
    this.filters();
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
    this.selectedSubCategory = null;
    this.form.controls.subCategory.setValue(null);
  }

  onSubCategoryChange() {
    this.selectedSubCategory = this.form.get('subCategory').value;
  }

  update() {
    this.selectedSubCategory = this.selected.subCategory;
    this.update_category();
    this.form.reset(new Equipment());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
  }

  create() {
    this.selectedSubCategory = null;
    this.update_category();
    this.selected = new Equipment();
    this.selected.characteristics = [];
    this.form.reset(this.selected);
    this.isCreateForm = true;
  }

  update_category() {
    // retrieve subcategory for the modal
    if (this.selectedSubCategory !== undefined
      && this.selectedSubCategory !== null) {
      this.categories.forEach(category => {
        const id = this.selectedSubCategory.id;
        if (category.subCategories.some(e => e.id === id)) {
          this.selectedCategory = category;
          this.categoryForm.controls.category.setValue(category);
        }
      });
    } else {
      this.selectedCategory = null;
    }
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

  delete(deleteValue) {
    const index = this.equipments.indexOf(deleteValue);
    this.equipments.splice(index, 1);
    this.loading = false;
    this.manageDeleteError(undefined);
    this.selected = null;
  }

  onDelete() {
    this.loading = true;
    this.manageDeleteError(undefined);
    this.service.delete(this.selected).subscribe(next => {
      this.delete(this.selected);
      this.endTransaction();
    }, error => {
      if (error.status === 404) {
        this.delete(this.selected);
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
