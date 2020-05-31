import { Component, OnInit, SimpleChange } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EquipmentService } from '@app/_services/equipment.service';
import { Equipment } from '@app/_models/equipment';

import { Category } from '@app/_models/category';
import { User, Role } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { UserOwnedUpdateComponent } from '../user-owned-update/user-owned-update.component';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { EquipmentFilterComponent } from './equipment-filter/equipment-filter.component';
import { EquipmentUpdateComponent } from './equipment-update/equipment-update.component';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';

declare var $: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  @ViewChild('categoryPopup', { static: true }) categoryPopup;

  @ViewChild('haveOwnedModal', { static: false }) haveOwnedModal: UserOwnedUpdateComponent;
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;

  @ViewChild('equipmentFilter', { static: false }) equipmentFilter: EquipmentFilterComponent;
  @ViewChild('equipmentUpdate', { static: false }) equipmentUpdate: EquipmentUpdateComponent;

  equipments: Equipment[];
  equipmentsFilter: Equipment[];
  selected = undefined;

  loading = false;

  haveEquipment: Equipment = null;

  currentUser: User;

  haveForm: FormGroup;

  errors = new FormErrors();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: EquipmentService,
    private categoryServiceP: CategoryPaginationSearchService,
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

  get categoryService() { return this.categoryServiceP; }

  canEditOrDelete(equipment) {
    return equipment
      && equipment.id !== undefined
      && (equipment.validate === false
        || (equipment.validate === true && this.isAmbassador));
  }

  ngOnInit() {
    this.loading = true;
    this.service.getAll()
      .pipe(first())
      .subscribe(equipments => {
        this.loading = false;
        this.equipments = equipments;
        this.equipments.forEach(equipment => {
          if (this.currentUser.haves.some(
            have => have.equipment.id === equipment.id)) {
            equipment.has = true;
          }
        });
      });

    this.categoryService.init(undefined, undefined, undefined, false, true);

    this.haveForm = this.formBuilder.group({
      wantQuantity: [0, Validators.required],
      ownQuantity: [0, Validators.required],
      characteristic: [null, Validators.required],
      equipment: [null, Validators.required]
    });
  }

  onDoneHave($event) {
    if ($event) {
      this.equipmentFilter.filters();
    }
  }

  filterDone($event) {
    this.equipmentsFilter = $event;
  }

  setSelected(selected: Equipment) {
    if (this.selected === selected) {
      this.selected = undefined;
    } else {
      this.selected = selected;
    }
  }

  updateDblClick(equipment) {
    this.selected = equipment;
    this.equipmentUpdate.update(equipment);
  }

  equipmentAdded($doneStatus: SimpleChange) {
    if ($doneStatus) {
      if ($doneStatus.previousValue === null) {
        // Push here into the array to be taken into account in the view.
        this.equipments.push(new Equipment($doneStatus.currentValue));
      } else if ($doneStatus.currentValue === null) {
        const $scope = this.currentUser.haves;
        for (let i = $scope.length - 1; i >= 0; i--) {
          if ($scope[i].equipment.id === $doneStatus.previousValue.id) {
            $scope.splice(i, 1);
          }
        }
      }
      this.equipmentFilter.filters();
    }
  }

  updateAskValidate(equipment: Equipment) {
    this.errors = new FormErrors();
    this.setSelected(equipment);
    this.loading = true;
    equipment.askValidate = !equipment.askValidate;
    this.service.update(equipment)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        equipment.askValidate = !equipment.askValidate;
        this.loading = false;
      });
  }
}
