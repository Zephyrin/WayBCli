import { Component, OnInit, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { SimpleChange, Input } from '@angular/core';

import { SubCategory, Category } from '@app/_models/';

import { SubCategoryService } from '@app/_services/sub-category.service';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { SubCategoryUpdateComponent } from '@app/equipment/sub-category/sub-category-update/sub-category-update.component';
import { FormErrors } from '@app/_errors';

@Component({
  selector: 'app-sub-category-validator',
  templateUrl: './sub-category-validator.component.html',
  styleUrls: ['./sub-category-validator.component.less']
})
export class SubCategoryValidatorComponent implements OnInit, OnDestroy {
  @Input() subCategories: SubCategory[];
  @Input() loadingParent: boolean;
  @Input()
  set parent(parent: Category) {
    this.$parent = parent;
    if (this.$subCategoryModal) {
      this.$subCategoryModal.parent = this.$parent;
    }
  }
  get parent() {
    return this.$parent;
  }
  @Input()
  set subCategoryModal(subCategoryModal: SubCategoryUpdateComponent) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.$subCategoryModal = subCategoryModal;
    if (this.$subCategoryModal) {
      if (this.$parent) {
        this.$subCategoryModal.parent = this.$parent;
      }
      this.subscription = this.$subCategoryModal.updateDone
        .subscribe(item => this.onUpdateDone(item));
    }
  }
  get subCategoryModal() { return this.$subCategoryModal; }

  loading = false;

  selected = undefined;
  subscription: any;
  errors = new FormErrors();

  private $parent: Category;
  private $subCategoryModal: SubCategoryUpdateComponent;
  constructor(
    private router: Router,
    private service: SubCategoryService,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loading = true;

    this.loading = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setSelected(subCategory: SubCategory) {
    this.selected = subCategory;
  }

  dblClick(subCategory: SubCategory) {
    if (this.canEditOrDelete(subCategory)) {
      this.subCategoryModal.open(subCategory);
    }
  }

  canEditOrDelete(subCategory: SubCategory) {
    return subCategory.validate || subCategory.askValidate;
  }

  updateValidate(subCategory: SubCategory) {
     //this.errors = new FormErrors();
     this.setSelected(subCategory);
     this.loading = true;
     subCategory.validate = !subCategory.validate;
     this.service.update(this.parent.id, subCategory)
       .subscribe(returnValue => {
         this.loading = false;
       }, (error: any) => {
         //this.errors.formatError(error);
         subCategory.validate = !subCategory.validate;
         this.loading = false;
       });
  }

  onUpdateDone(simple: SimpleChange) {
    setTimeout(() => {
      if (simple !== undefined && simple !== null) {
        if (simple.previousValue === null) {
          this.subCategories.push(simple.currentValue);
        } else if (simple.currentValue === null) {
          const index = this.subCategories
            .findIndex(x => x.id === simple.previousValue.id);
          if (index >= 0) {
            this.subCategories.splice(index, 1);
          }
        } else {
          Object.assign(simple.previousValue, simple.currentValue);
        }
        this.cd.detectChanges();
      }
    });
  }

}
