import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
// used to create fake backend
// import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register/register.component';
import { LogService } from './_services/log.service';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { UserComponent } from './equipment/_admin/user/user.component';
import { CategoryComponent } from './equipment/category/category.component';
import { SubCategoryComponent } from './equipment/sub-category/sub-category.component';
import { CharacteristicComponent } from './equipment/characteristic/characteristic.component';
import { UserOwnedComponent } from './equipment/user-owned/user-owned.component';

import { UserOwnedUpdateComponent } from './equipment/user-owned-update/user-owned-update.component';
import { BrandUpdateComponent } from './equipment/brand/brand-update/brand-update.component';
import { DeleteComponent } from './_helpers/delete/delete.component';
import { SwitchComponent } from './_helpers/switch/switch.component';
import { EquipmentFilterComponent } from './equipment/equipment/equipment-filter/equipment-filter.component';
import { EquipmentUpdateComponent } from './equipment/equipment/equipment-update/equipment-update.component';
import { CharacteristicUpdateComponent } from './equipment/characteristic/characteristic-update/characteristic-update.component';
import { CategoryUpdateComponent } from './equipment/category/category-update/category-update.component';
import { SubCategoryUpdateComponent } from './equipment/sub-category/sub-category-update/sub-category-update.component';
import { CategoryValidatorComponent } from './equipment/category/category-validator/category-validator.component';
import { SubCategoryValidatorComponent } from './equipment/sub-category/sub-category-validator/sub-category-validator.component';
import { BrandComponent } from './equipment/brand/brand/brand.component';
import { EquipmentValidatorComponent } from './equipment/equipment/equipment-validator/equipment-validator.component';
import { CharacteristicValidatorComponent } from './equipment/characteristic/characteristic-validator/characteristic-validator.component';
import { BackpacksComponent } from './backpack/backpacks/backpacks.component';
import { BrandFilterComponent } from './equipment/brand/brand-filter/brand-filter.component';
import { PaginationComponent } from './_helpers/pagination/pagination.component';
import { FilterSwitchComponent } from './_helpers/filter-switch/filter-switch.component';
import { ComboPaginateComponent } from './_helpers/combo-paginate/combo-paginate.component';
import { CategoryFilterComponent } from './equipment/category/category-filter/category-filter.component';
import { ValidationAndSearchComponent } from './_helpers/validation-and-search/validation-and-search.component';
import { UserManagementComponent } from './_admins/user-management/user-management.component';
import { TopErrorsComponent } from './_helpers/errors/top-errors/top-errors.component';
import { TheadComponent } from './_helpers/tables/thead/thead.component';
import { ActionComponent } from './_helpers/action/action.component';
import { BackpackModalComponent } from './backpack/backpack-modal/backpack-modal.component';
import { BackpackComponent } from './backpack/backpack/backpack.component';
import { EquipmentHelpComponent } from './equipment/equipment-help/equipment-help.component';
import { PopulateComponent } from './equimpent/_admin/populate/populate.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    MatIconModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EquipmentComponent,
    UserComponent,
    CategoryComponent,
    SubCategoryComponent,
    CharacteristicComponent,
    UserOwnedComponent,
    UserOwnedUpdateComponent,
    BrandUpdateComponent,
    DeleteComponent,
    SwitchComponent,
    EquipmentFilterComponent,
    EquipmentUpdateComponent,
    CharacteristicUpdateComponent,
    CategoryUpdateComponent,
    SubCategoryUpdateComponent,
    CategoryValidatorComponent,
    SubCategoryValidatorComponent,
    BrandComponent,
    EquipmentValidatorComponent,
    CharacteristicValidatorComponent,
    BackpacksComponent,
    BrandFilterComponent,
    PaginationComponent,
    FilterSwitchComponent,
    ComboPaginateComponent,
    CategoryFilterComponent,
    ValidationAndSearchComponent,
    UserManagementComponent,
    TopErrorsComponent,
    TheadComponent,
    ActionComponent,
    BackpackModalComponent,
    BackpackComponent,
    EquipmentHelpComponent
,
    PopulateComponent    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  exports: [
    MatIconModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
