import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CachingService } from './caching.service';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private path = "https://api-fact.onrender.com"

  private http = inject(HttpClient)
  private cacheService = inject(CachingService)
  constructor() { }

  public getProducts():Observable<any> {
    const url = `${this.path}/productos/`
    const cachedResponse = this.cacheService.get(url);
    if (cachedResponse){
      return cachedResponse
    }else {
      return this.http.get(url)
      .pipe(
        tap(response => this.cacheService.set(url,response)),
        map(response => response),
        catchError(requestError=>throwError(requestError))
      )
    }
  }
}
