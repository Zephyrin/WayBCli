import { Component, OnInit, SimpleChange, Input } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '@app/_models/equipment';

import { User, Role } from '@app/_models';

import { AuthenticationService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

import { UserOwnedUpdateComponent } from '../user-owned-update/user-owned-update.component';
import { BrandUpdateComponent } from '@app/equipment/brand/brand-update/brand-update.component';
import { EquipmentFilterComponent } from './equipment-filter/equipment-filter.component';
import { EquipmentUpdateComponent } from './equipment-update/equipment-update.component';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';
import { EquipmentPaginationSearchService } from '@app/_services/equipment/equipment-pagination-search.service';
import { SortByEnum, SortEnum } from '@app/_enums/equipment.enum';

declare var $: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  @Input() isValidator = false;

  @ViewChild('categoryPopup', { static: true }) categoryPopup;

  @ViewChild('haveOwnedModal', { static: false }) haveOwnedModal: UserOwnedUpdateComponent;
  @ViewChild('brandModal', { static: false }) brandModal: BrandUpdateComponent;

  @ViewChild('equipmentFilter', { static: false }) equipmentFilter: EquipmentFilterComponent;
  @ViewChild('equipmentUpdate', { static: false }) equipmentUpdate: EquipmentUpdateComponent;

  haveEquipment: Equipment = null;

  haveForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviceP: EquipmentPaginationSearchService,
    private categoryServiceP: CategoryPaginationSearchService,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.authenticationService.currentUser.subscribe(
      x => this.service.currentUser = x);
    if (window.location.pathname === '/equipmentsValidator') {
      this.isValidator = true;
    }
  }

  get service() { return this.serviceP; }

  get isAmbassador() {
    const isAmbassador = this.service.currentUser
      && this.service.currentUser.roles
      && (this.service.currentUser.roles.indexOf(Role.Ambassador) !== -1
        || this.service.currentUser.roles.indexOf(Role.Admin) !== -1
        || this.service.currentUser.roles.indexOf(Role.SuperAdmin) !== -1);
    return isAmbassador;
  }

  get categoryService() { return this.categoryServiceP; }

  get sortByEnum() { return SortByEnum; }
  get sortEnum() { return SortEnum; }

  canEditOrDelete(equipment) {
    return equipment
      && equipment.id !== undefined
      && (equipment.validate === false
        || (equipment.validate === true && this.isAmbassador));
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service.init(this.router, this.route, params);
      this.service.isValidator = this.isValidator;
    });

    this.categoryService.init(undefined, undefined, undefined);
    this.categoryService.isValidator = false;

    this.haveForm = this.formBuilder.group({
      wantQuantity: [0, Validators.required],
      ownQuantity: [0, Validators.required],
      characteristic: [null, Validators.required],
      equipment: [null, Validators.required]
    });
  }

  onDoneHave($event) {
    if ($event) {
    }
  }

  updateDblClick(equipment) {
    this.service.setSelected(equipment);
    this.equipmentUpdate.update(equipment);
  }
}
