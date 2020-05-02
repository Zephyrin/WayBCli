import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Characteristic } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class CharacteristicService {

  constructor(private http: HttpClient) { }

  create(eqId: number, characteristic: Characteristic): Observable<Characteristic> {
    return this.http.post<Characteristic>(
      `${environment.apiUrl}/equipment/${eqId}/characteristic`, characteristic)
      .pipe(map(eq => {
        return eq;
      }));
  }

  delete(eqId: number, characteristic: Characteristic): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/equipment/${eqId}/characteristic/${characteristic.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(eqId: number, characteristic: Characteristic): Observable<Characteristic> {
    return this.http.put<Characteristic>(
      `${environment.apiUrl}/equipment/${eqId}/characteristic/${characteristic.id}`, characteristic)
      ;
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
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
