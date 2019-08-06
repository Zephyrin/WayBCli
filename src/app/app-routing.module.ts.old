import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { BrandUpdateComponent } from './brand-update/brand-update.component';
import { BrandsListComponent } from './brands-list/brands-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'create-brand' },
  { path: 'create-brand', component: BrandCreateComponent },
  { path: 'brand-details/:id', component: BrandDetailsComponent },
  { path: 'update-brand', component: BrandUpdateComponent },
  { path: 'brands-list', component: BrandsListComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }