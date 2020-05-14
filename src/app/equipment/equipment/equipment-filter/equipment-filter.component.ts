import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Equipment, User } from '@app/_models';
import { Category, SubCategory } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-filter',
  templateUrl: './equipment-filter.component.html',
  styleUrls: ['./equipment-filter.component.scss']
})
export class EquipmentFilterComponent implements OnInit {
  @ViewChild('ownedBtn', { static: false }) ownedBtn: ElementRef;
  @ViewChild('wishesBtn', { static: false }) wishesBtn: ElementRef;
  @ViewChild('othersBtn', { static: false }) othersBtn: ElementRef;
  @ViewChild('searchText', { static: false }) searchText: ElementRef;
  @Output() filterDone = new EventEmitter<Equipment[]>();
  @Input()
  set equipments(equipments: Equipment[]) {
    this.equipmentsP = equipments;
    if (this.categoriesP) {
      this.filters();
    }
  }
  get equipments() { return this.equipmentsP; }
  @Input()
  set categories(categories: Category[]) {
    if (categories) {
      categories.forEach(categorie => {
        categorie.subCategories.forEach(sub => {
          this.filterSubCategories.push(sub);
        });
      });
    }
    this.categoriesP = categories;
    if (this.equipments) {
      this.filters();
    }
  }
  get categories() { return this.categoriesP; }

  equipmentsFilter: Equipment[];
  filterSubCategories: SubCategory[] = [];

  searchForm: FormGroup;

  currentUser: User;

  private equipmentsP: Equipment[];
  private categoriesP: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  prevent(event) {
    event.stopPropagation();
  }

  compareByID(itemOne, itemTwo) {
    if (itemOne === null && itemTwo === null) {
      return true;
    }
    return itemOne && itemTwo && itemOne.id === itemTwo.id;
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
    $(this.ownedBtn.nativeElement).prop('checked', true).parent().addClass('active');
    $(this.wishesBtn.nativeElement).prop('checked', true).parent().addClass('active');
    $(this.othersBtn.nativeElement).prop('checked', false).parent().removeClass('active');
    this.searchText.nativeElement.value = '';
    this.filters();
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
    if (this.equipments === undefined || this.categories === undefined) {
      return;
    }
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
              ue => !(ue.wantQuantity <= 0 && ue.ownQuantity <= 0)
                && ue.equipment.id === equipment.id)
            )
          )
      )
    );
    this.filterDone.emit(this.equipmentsFilter);
  }
}
