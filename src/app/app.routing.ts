import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './auth/login';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './auth/register/register.component';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { UserComponent } from './equipment/_admin/user/user.component';
import { CategoryComponent } from './equipment/category/category.component';
import { BrandValidatorComponent } from './equipment/brand/brand-validator/brand-validator.component';
import { CategoryValidatorComponent } from './equipment/category/category-validator/category-validator.component';
import { BrandComponent } from './equipment/brand/brand/brand.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'equipments', component: EquipmentComponent},
    { path: 'users', component: UserComponent},
    { path: 'categories', component: CategoryComponent},
    { path: 'brands', component: BrandComponent },
    { path: 'brandsValidator', component: BrandValidatorComponent },
    { path: 'categoriesValidator', component: CategoryValidatorComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
