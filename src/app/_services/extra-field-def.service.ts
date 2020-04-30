import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ExtraFieldDef } from '@app/_models';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraFieldDefService {

  constructor(private http: HttpClient) { }

  getAll(categoryId: number, subCategoryId: number) {
  return this.http.get<ExtraFieldDef[]>(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef`
    );
  }

  count(categoryId: number, subCategoryId: number) {
  return this.http.head(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef`
    , { observe: 'response'} );
  }

  create(categoryId: number
      ,  subCategoryId: number
      ,  extraFieldDef: ExtraFieldDef): Observable<ExtraFieldDef> {
  return this.http.post<ExtraFieldDef>(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef`
    , extraFieldDef);
  }

  get(categoryId: number
    , subCategoryId: number
    , id: number): Observable<ExtraFieldDef> {
  return this.http.get<ExtraFieldDef>(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef/${id}`
    );
  }

  update(categoryId: number
    ,    subCategoryId: number
    ,    extraFieldDef: ExtraFieldDef): Observable<ExtraFieldDef> {
  return this.http.put<ExtraFieldDef>(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef/${extraFieldDef.id}`
    , extraFieldDef);
  }

  updatePart(categoryId: number
    ,        subCategoryId: number
    ,        extraFieldDef: ExtraFieldDef): Observable<ExtraFieldDef> {
  return this.http.patch<ExtraFieldDef>(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef/${extraFieldDef.id}`
    , extraFieldDef);
  }

  delete(categoryId: number
    ,    subCategoryId: number
    ,    extraFieldDef: ExtraFieldDef): Observable<{}> {
  return this.http.delete(
    `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategoryId}/extrafielddef/${extraFieldDef.id}`
    )
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error instanceof String
       || typeof(error) === 'string') {
      console.error(error);
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
    }
    // return an observable with a category-facing error message
    return throwError(error);
  }
}
