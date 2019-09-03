import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient,
    private authenticationService: AuthenticationService) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/user`);
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
    
      private handleError(error: any) {
        if (error instanceof String
          || typeof(error) === 'string'){
          console.error(error);
        }
        else if (error.error instanceof ErrorEvent) {
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
      };
    
}
