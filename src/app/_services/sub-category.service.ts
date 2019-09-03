import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { SubCategory } from '@app/_models';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  constructor(private http: HttpClient) { }

    getAll(categoryId: number) {
        return this.http.get<SubCategory[]>(`${environment.apiUrl}/category/${categoryId}/subcategory`);
    }

    create(categoryId: number, subCategory: SubCategory): Observable<SubCategory> {
      return this.http.post<SubCategory>(`${environment.apiUrl}/category/${categoryId}/subcategory`, subCategory);
    }

    get(categoryId: number, id: number): Observable<SubCategory> {
      return this.http.get<SubCategory>(`${environment.apiUrl}/category/${categoryId}/subcategory/${id}`);
    }

    update(categoryId: number, subCategory: SubCategory): Observable<SubCategory> {
      return this.http.put<SubCategory>(
        `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategory.id}`, subCategory)
        ;
    }

    updatePart(categoryId: number, subCategory: SubCategory): Observable<SubCategory> {
      return this.http.patch<SubCategory>(
        `${environment.apiUrl}/category/${categoryId}/subcategory/${subCategory.id}`, subCategory)
        ;
    }

    delete(categoryId: number, subCategory: SubCategory): Observable<{}> {
      return this.http.delete(`${environment.apiUrl}/category/${categoryId}/subcategory/${subCategory.id}`)
        .pipe(
          catchError(this.handleError)
        );
    }

    private handleError(error: any) {
      if (error instanceof String
        || typeof(error) === 'string'){
        console.error(error);
      }
      else if (error.error instanceof ErrorEvent) {
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
    };
}
