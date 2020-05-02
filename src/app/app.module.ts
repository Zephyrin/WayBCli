import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
// import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register/register.component';
import { BrandComponent } from './equipment/brand/brand.component';
import { LogService } from './_services/log.service';
import { EquipmentComponent } from './equipment/equipment/equipment.component';
import { UserComponent } from './equipment/_admin/user/user.component';
import { CategoryComponent } from './equipment/_ambassador/category/category.component';
import { SubCategoryComponent } from './equipment/_ambassador/sub-category/sub-category.component';
import { CharacteristicComponent } from './equipment/equipment/characteristic/characteristic.component';;
import { UserOwnedComponent } from './equipment/user-owned/user-owned.component'
import {MatIconModule} from '@angular/material/icon';

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
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        BrandComponent,
        EquipmentComponent,
        UserComponent,
        CategoryComponent,
        SubCategoryComponent
,
        CharacteristicComponent ,
        UserOwnedComponent   ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
