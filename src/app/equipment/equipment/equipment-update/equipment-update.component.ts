import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChange } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, filter } from 'rxjs/operators';

import { EquipmentService } from '@app/_services/equipment/equipment.service';
import { Equipment } from '@app/_models/equipment';

import { BrandService } from '@app/_services/brand/brand.service';

import { Category } from '@app/_models/category';
import { SubCategory } from '@app/_models/sub-category';
import { Brand } from '@app/_models/brand';
import { User, Role } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { CharacteristicUpdateComponent } from '@app/equipment/characteristic/characteristic-update/characteristic-update.component';
import { HttpParams } from '@angular/common/http';
import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';
import { FilterEnum } from '@app/_enums/filter.enum';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';

declare var $: any;

@Component({
  selector: 'app-equipment-update',
  templateUrl: './equipment-update.component.html',
  styleUrls: ['./equipment-update.component.scss']
})
export class EquipmentUpdateComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('deleteModal', { static: true }) deleteModal;
  @Output() updateDone = new EventEmitter<SimpleChange>();
  @Input() characteristicModal: CharacteristicUpdateComponent;
  @Input()
  set equipments(equipments: Equipment[]) {
    this.equipmentsP = equipments;
  }
  get equipments() { return this.equipmentsP; }

  get categories() { return this.categoryService.values; }
  /*  @Input()
   set parentData(equipment: Equipment) {
     this.selected = equipment;
   }
   get parentData() { return this.selected; }*/
  currentUser: User;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  categoryForm: FormGroup;
  brands: Brand[];

  selectedCategory: Category = null;

  selectedSubCategory: SubCategory = null;
  simpleChange: SimpleChange;

  simpleChangeCharacteristic: SimpleChange;

  get f() { return this.form.controls; }

  private equipmentsP: Equipment[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: EquipmentService,
    private categoryService: CategoryPaginationSearchService,
    private brandServiceP: BrandPaginationSearchService,
    private authenticationService: AuthenticationService
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  get brandService() { return this.brandServiceP; }

  get filterType() { return FilterEnum; }

  ngOnInit(): void {
    this.deleteHasError = false;
    this.loading = true;
    this.categoryService.initWithParams(undefined, undefined, undefined, undefined, '0', undefined);
    this.categoryService.isValidator = false;
    this.brandServiceP.init(undefined, undefined, undefined);
    this.brandServiceP.isValidator = false;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      brand: [null],
      subCategory: [null, Validators.required],
      characteristics: [[]]
    });
    this.categoryForm = this.formBuilder.group({
      category: [null, Validators.required]
    });
    this.loading = false;
  }

  hasError(name) {
    return this.submitted
      && (this.form.controls[name].errors
        || this.errors.hasErrors[name]);
  }

  brandAdded($event) {
    this.form.patchValue({ brand: $event });
  }

  updateDoneCharacteristic($event) {
    this.simpleChangeCharacteristic = $event;
  }

  onCategoryChange() {
    this.selectedCategory = this.categoryForm.get('category').value;
    this.selectedSubCategory = null;
    this.form.controls.subCategory.setValue(null);
  }

  onSubCategoryChange() {
    this.selectedSubCategory = this.form.get('subCategory').value;
  }

  update(equipment) {
    this.simpleChange = new SimpleChange(equipment, equipment, true);
    this.selected = equipment;
    this.selectedSubCategory = this.selected.subCategory;
    this.update_category();
    this.form.reset(new Equipment());
    this.form.patchValue(equipment);
    this.isCreateForm = false;
    $(this.modal.nativeElement).modal('show');
  }

  create() {
    this.selectedSubCategory = null;
    this.selectedCategory = null;
    this.categoryForm.reset();
    // this.update_category();
    this.selected = new Equipment();
    this.simpleChange = new SimpleChange(null, null, true);
    this.selected.characteristics = [];
    this.form.reset(this.selected);
    this.isCreateForm = true;
    $(this.modal.nativeElement).modal('show');
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
          this.form.value.subCategory = subCategory;
          // Must to be done into the parent view to be takken into account in
          // the view...
          // this.equipments.push(equipment);
          this.simpleChange.currentValue = equipment;
          this.endTransaction();
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

  _delete(deleteValue) {
    const index = this.equipments.indexOf(deleteValue);
    this.equipments.splice(index, 1);
    this.loading = false;
    this.manageDeleteError(undefined);
    this.selected = null;
  }

  onDelete(deleteValue: Equipment) {
    this.selected = deleteValue;
    this.simpleChange = new SimpleChange(this.selected, null, true);
    this.deleteModal.open();
  }

  delete($event: boolean) {
    if ($event) {
      this.loading = true;
      this.manageDeleteError(undefined);
      this.service.delete(this.simpleChange.previousValue).subscribe(next => {
        this._delete(this.simpleChange.previousValue);
        this.endTransaction();
      }, error => {
        if (error.status === 404) {
          this._delete(this.simpleChange.previousValue);
          this.endTransaction();
        } else {
          this.manageDeleteError(error.message);
        }
      });
    }
  }

  manageDeleteError(message: string) {
    this.deleteError = message;
    this.deleteHasError = message !== undefined;
  }

  endTransaction() {
    this.loading = false;
    this.submitted = false;
    this.deleteModal.close();
    $(this.modal.nativeElement).modal('hide');
    this.updateDone.emit(this.simpleChange);
  }

  endTransactionError(error) {
    this.errors.formatError(error);
    this.loading = false;
  }
}
