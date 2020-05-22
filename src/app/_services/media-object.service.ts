import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Mediaobject } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class MediaobjectService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Mediaobject[]>(`${environment.apiUrl}/mediaobject`);
  }

  get(mediaobject: Mediaobject): Observable<Mediaobject> {
    return this.http.get<Mediaobject>(`${environment.apiUrl}/mediaobject/${mediaobject.id}`)
      .pipe(map(retMediaobject => {
        return retMediaobject;
      }));
  }

  create(mediaobject: Mediaobject): Observable<Mediaobject> {
    return this.http.post<Mediaobject>(`${environment.apiUrl}/mediaobject`, mediaobject)
      .pipe(map(retMediaobject => {
        return retMediaobject;
      }));
  }

  update(mediaobject: Mediaobject): Observable<Mediaobject> {
    return this.http.put<Mediaobject>(`${environment.apiUrl}/mediaobject/${mediaobject.id}`, mediaobject);
  }

  delete(mediaobject: Mediaobject): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/mediaobject/${mediaobject.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    if (error instanceof String
      || typeof (error) === 'string') {
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
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
