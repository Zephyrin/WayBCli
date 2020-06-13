import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Brand } from '@app/_models';

import { HttpService } from '@app/_services/http.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends HttpService<Brand> {

  constructor(private http: HttpClient) {
      super();
     }

  getAll(httpParams: HttpParams): Observable<HttpResponse<Brand[]>> {
    return this.http.get<Brand[]>(
      `${environment.apiUrl}/brand`
      , { params: httpParams, observe: 'response' }
      );
  }

  create(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${environment.apiUrl}/brand`, brand)
      .pipe(map(retBrand => {
        return retBrand;
      }));
  }

  update(brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(
      `${environment.apiUrl}/brand/${brand.id}`
      , brand);
  }

  delete(brand: Brand): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/brand/${brand.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  get(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${environment.apiUrl}/brand/${id}`);
  }
}
