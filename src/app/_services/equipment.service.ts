import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Equipment } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Equipment[]>(`${environment.apiUrl}/equipment`)
      .pipe(map(response => {
        const details = response.map(data => new Equipment(data));
        return details;
    }));
  }

  create(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(
      `${environment.apiUrl}/equipment`, equipment)
      .pipe(map(eq => new Equipment(eq) ));
  }

  delete(equipment: Equipment): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/equipment/${equipment.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(
      `${environment.apiUrl}/equipment/${equipment.id}`, equipment)
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
