import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';

import { Backpack } from '@app/_models/backpack.ts';
import { User } from '@app/_models/';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackpackService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/login']);
      }
     }

  getAll(user: User) {
    return this.http.get<Backpack[]>(`${environment.apiUrl}/user/${user.id}/backpack`);
  }

  create(user: User, backpack: Backpack): Observable<Backpack> {
    return this.http.post<Backpack>(`${environment.apiUrl}/user/${user.id}/backpack`, backpack);
  }

  get(user: User, id: number): Observable<Backpack> {
    return this.http.get<Backpack>(`${environment.apiUrl}/user/${user.id}/backpack/${id}`);
  }

  update(user: User, backpack: Backpack): Observable<Backpack> {
    return this.http.put<Backpack>(
      `${environment.apiUrl}/user/${user.id}/backpack/${backpack.id}`, backpack)
      ;
  }

  updatePart(user: User, backpack: Backpack): Observable<Backpack> {
    return this.http.patch<Backpack>(
      `${environment.apiUrl}/user/${user.id}/backpack/${backpack.id}`, backpack)
      ;
  }

  delete(user: User, backpack: Backpack): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/user/${user.id}/backpack/${backpack.id}`)
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
    // return an observable with a category-facing error message
    return throwError(error);
  }
}
