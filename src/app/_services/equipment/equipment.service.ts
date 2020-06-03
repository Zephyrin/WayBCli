import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Equipment } from '@app/_models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends HttpService<Equipment> {

  constructor(private http: HttpClient) {
    super();
  }

  getAll(httpParams: HttpParams) {
    return this.http.get<Equipment[]>(
      `${environment.apiUrl}/equipment`
      , { params: httpParams, observe: 'response'});
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
}
