import { environment } from '@environments/environment';
import { HttpService } from '@app/_services/http.service';
import { HttpClient } from '@angular/common/http';
import { IntoBackpack } from '@app/_models/into-backpack';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IntoBackpackService extends HttpService<IntoBackpack> {
  public userId: number;
  public backpackId: number;
  constructor(private http: HttpClient) {
    super();
  }

  getAll(
    httpParams: import('@angular/common/http').HttpParams
  ): import('rxjs').Observable<
    import('@angular/common/http').HttpResponse<IntoBackpack[]>
  > {
    return this.http.get<IntoBackpack[]>(
      `${environment.apiUrl}/user/${this.userId}/backpack/${this.backpackId}/intobackpack`,
      { params: httpParams, observe: 'response' }
    );
  }
  update(elt: IntoBackpack): import('rxjs').Observable<IntoBackpack> {
    return this.http.put<IntoBackpack>(
      `${environment.apiUrl}/user/${this.userId}/backpack/${this.backpackId}/intobackpack/${elt.id}`,
      elt
    );
  }
  delete(elt: IntoBackpack): import('rxjs').Observable<{}> {
    return this.http
      .delete(
        `${environment.apiUrl}/user/${this.userId}/backpack/${this.backpackId}/intobackpack/${elt.id}`
      )
      .pipe(catchError(this.handleError));
  }
  create(elt: IntoBackpack): import('rxjs').Observable<IntoBackpack> {
    return this.http.post<IntoBackpack>(
      `${environment.apiUrl}/user/${this.userId}/backpack/${this.backpackId}/intobackpack`,
      elt
    );
  }
  get(id: number): import('rxjs').Observable<IntoBackpack> {
    return this.http.get<IntoBackpack>(
      `${environment.apiUrl}/user/${this.userId}/backpack/${this.backpackId}/${id}`
    );
  }
}
