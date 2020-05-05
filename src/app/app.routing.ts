import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './auth/login';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './auth/register/register.component';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { UserComponent } from './equipment/_admin/user/user.component';
import { CategoryComponent } from './equipment/_ambassador/category/category.component';
import { BrandValidatorComponent } from './equipment/brand/brand-validator/brand-validator.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'equipment', component: EquipmentComponent},
    { path: 'users', component: UserComponent},
    { path: 'category', component: CategoryComponent},
    { path: 'brandsValidator', component: BrandValidatorComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
