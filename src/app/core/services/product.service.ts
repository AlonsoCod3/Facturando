import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CachingService } from './caching.service';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private pathProducts = import.meta.env.NG_APP_PRODUCT

  private http = inject(HttpClient)
  private cacheService = inject(CachingService)
  private dataCache = signal<any[] | null>(null);

  constructor() { }

  public getProducts():Observable<any> {
    const url = `${this.pathProducts}/products/`
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
  public newProduct(body:any):Observable<any> {
    const url = `${this.pathProducts}/products/`
    // const cachedResponse = this.cacheService.get(url);
    // if (cachedResponse){
    //   return cachedResponse
    // }else {
      return this.http.post(url, body)
      .pipe(
        // tap(response => this.cacheService.set(url,response)),
        map(response => response),
        catchError(requestError=>throwError(requestError))
      )
    // }
  }

  getData() {
    if (this.dataCache()) {
      return new Observable(observer => {
        observer.next(this.dataCache()!);
        observer.complete();
      });
    }

    return this.http.get<any[]>(this.pathProducts + "/verify").pipe(
      tap(posts => this.dataCache.set(posts))
    );
  }

  setCache(data: any) {
    this.dataCache.set(data);
  }

  clearCache() {
    this.dataCache.set(null);
  }
}
