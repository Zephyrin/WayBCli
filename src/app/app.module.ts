import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';

import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { BrandUpdateComponent } from './brand-update/brand-update.component';
import { BrandsListComponent } from './brands-list/brands-list.component';

@NgModule({
  declarations: [
    AppComponent,
    BrandCreateComponent,
    BrandDetailsComponent,
    BrandUpdateComponent,
    BrandsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
