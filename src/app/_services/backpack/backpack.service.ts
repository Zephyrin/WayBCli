import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services/authentication.service';

import { Backpack } from '@app/_models/backpack.ts';
import { User } from '@app/_models/';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class BackpackService extends HttpService<Backpack> {
  public userId: number;
  constructor(
    private http: HttpClient) {
      super();
     }

  getAll(httpParams: HttpParams): Observable<HttpResponse<Backpack[]>> {
    return this.http.get<Backpack[]>(
      `${environment.apiUrl}/user/${this.userId}/backpack`
      , { params: httpParams, observe: 'response'});
  }

  create(backpack: Backpack): Observable<Backpack> {
    return this.http.post<Backpack>(`${environment.apiUrl}/user/${this.userId}/backpack`, backpack);
  }

  get(user: User, id: number): Observable<Backpack> {
    return this.http.get<Backpack>(`${environment.apiUrl}/user/${user.id}/backpack/${id}`);
  }

  update(backpack: Backpack): Observable<Backpack> {
    return this.http.put<Backpack>(
      `${environment.apiUrl}/user/${this.userId}/backpack/${backpack.id}`, backpack)
      ;
  }

  updatePart(user: User, backpack: Backpack): Observable<Backpack> {
    return this.http.patch<Backpack>(
      `${environment.apiUrl}/user/${user.id}/backpack/${backpack.id}`, backpack)
      ;
  }

  delete(backpack: Backpack): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/user/${this.userId}/backpack/${backpack.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
}
