import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './auth/register/register.component';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { UserComponent } from './equipment/_admin/user/user.component';
import { CategoryComponent } from './equipment/category/category.component';
import { BrandComponent } from './equipment/brand/brand/brand.component';
import { BackpacksComponent } from './backpack/backpacks/backpacks.component';
import { UserManagementComponent } from './_admins/user-management/user-management.component';
import { BackpackComponent } from './backpack/backpack/backpack.component';

const routes: Routes = [
    { path: '', component: BackpacksComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'equipments', component: EquipmentComponent},
    { path: 'users', component: UserComponent},
    { path: 'categories', component: CategoryComponent},
    { path: 'brands', component: BrandComponent },
    { path: 'brandsValidator', component: BrandComponent},
    { path: 'categoriesValidator', component: CategoryComponent},
    { path: 'equipmentsValidator', component: EquipmentComponent},
    { path: 'usersManagement', component: UserManagementComponent},
    { path: 'backpack', component: BackpackComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
