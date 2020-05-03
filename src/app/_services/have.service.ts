import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Have } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class HaveService {

  constructor(private http: HttpClient) { }

  getAll(userId: number): Observable<Have[]> {
    return this.http.get<Have[]>(`${environment.apiUrl}/user/${userId}/have`);
  }
  create(userId: number, have: Have): Observable<Have> {
    return this.http.post<Have>(`${environment.apiUrl}/user/${userId}/have`, have);
  }

  update(userId: number, have: Have): Observable<Have> {
    return this.http.put<Have>(
      `${environment.apiUrl}/user/${userId}/have/${have.id}`, have)
      ;
  }

  delete(userId: number, have: Have): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/user/${userId}/have/${have.id}`)
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
