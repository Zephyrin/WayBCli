import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Category } from '@app/_models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends HttpService<Category> {

  constructor(private http: HttpClient) {
    super();
  }

  getAll(httpParams: HttpParams) {
    return this.http.get<Category[]>(
      `${environment.apiUrl}/category`
      , { params: httpParams, observe: 'response' });
  }

  count() {
    return this.http.head(`${environment.apiUrl}/category`,
      { observe: 'response' }
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
}
