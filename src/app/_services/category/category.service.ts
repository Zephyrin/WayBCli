import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Category } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAll(httpParams: HttpParams) {
    return this.http.get<Category[]>(
      `${environment.apiUrl}/category`
      , { params: httpParams, observe: 'response'});
  }

  count() {
    return this.http.head(`${environment.apiUrl}/category`,
    {
      observe: 'response'}
      );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/category`, category);
  }

  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiUrl}/category/${id}`);
  }

  update(category: Category): Observable<Category> {
    return this.http.put<Category>(
      `${environment.apiUrl}/category/${category.id}`, category)
      ;
  }

  updatePart(category: Category): Observable<Category> {
    return this.http.patch<Category>(
      `${environment.apiUrl}/category/${category.id}`, category)
      ;
  }

  delete(category: Category): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/category/${category.id}`)
      .pipe(
        catchError(this.handleError)
      );
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
