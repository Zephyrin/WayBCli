﻿import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './auth/login';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './auth/register/register.component';
import { EquipmentComponent } from './equipment/equipment/equipment.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'equipment', component: EquipmentComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
