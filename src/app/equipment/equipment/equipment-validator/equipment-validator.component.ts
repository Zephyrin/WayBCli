import { Component, OnInit, SimpleChange } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, filter } from 'rxjs/operators';
import { EquipmentService } from '@app/_services/equipment.service';
import { Equipment } from '@app/_models/equipment';

import { CategoryService } from '@app/_services/category.service';
import { BrandService } from '@app/_services/brand.service';

import { Category } from '@app/_models/category';
import { User, Role } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { EquipmentFilterComponent } from '../equipment-filter/equipment-filter.component';
import { EquipmentUpdateComponent } from '../equipment-update/equipment-update.component';

declare var $: any;

@Component({
  selector: 'app-equipment-validator',
  templateUrl: './equipment-validator.component.html',
  styleUrls: ['./equipment-validator.component.scss']
})
export class EquipmentValidatorComponent implements OnInit {
  @ViewChild('categoryPopup', { static: true }) categoryPopup;

  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;

  @ViewChild('equipmentFilter', { static: false }) equipmentFilter: EquipmentFilterComponent;
  @ViewChild('equipmentUpdate', { static: false }) equipmentUpdate: EquipmentUpdateComponent;

  equipments: Equipment[];
  equipmentsFilter: Equipment[];
  selected = undefined;

  loading = false;


  categories: Category[];

  haveEquipment: Equipment = null;

  currentUser: User;

  haveForm: FormGroup;

  errors = new FormErrors();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: EquipmentService,
    private categoryService: CategoryService,
    private brandService: BrandService,
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

  canEditOrDelete(equipment) {
    return equipment
      && equipment.id !== undefined
      && ((equipment.validate === true && this.isAmbassador)
        || equipment.askValidate);
  }

  ngOnInit() {
    this.loading = true;
    this.service.getAll()
      .pipe(first())
      .subscribe(equipments => {
        this.loading = false;
        this.equipments = equipments.filter(x => x.askValidate || x.validate);
        this.equipments.forEach(equipment => {
          equipment.characteristics = equipment.characteristics.filter(x => x.askValidate || x.validate);
        });
      });

    this.categoryService.getAll()
      .pipe(first())
      .subscribe(categories => {
        this.categories = categories;
      });

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

  updateValidate(equipment: Equipment) {
    this.errors = new FormErrors();
    this.setSelected(equipment);
    this.loading = true;
    equipment.validate = !equipment.validate;
    this.service.update(equipment)
      .subscribe(returnValue => {
        this.loading = false;
      }, (error: any) => {
        this.errors.formatError(error);
        equipment.validate = !equipment.validate;
        this.loading = false;
      });
  }
}
