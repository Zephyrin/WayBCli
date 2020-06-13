import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { HttpService } from '@app/_services/http.service';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpService<User> {
  constructor(
    private http: HttpClient) {
    super();
  }

  getAll(httpParams: HttpParams): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(`${environment.apiUrl}/user`
      , { params: httpParams, observe: 'response' });
  }

  update(user: User): Observable<User> {
    return this.http.patch<User>(
      `${environment.apiUrl}/user/${user.id}`, user)
      ;
  }

  delete(user: User): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/user/${user.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  create(user: User): Observable<User> {
    return null;
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/${id}`);
  }
}
