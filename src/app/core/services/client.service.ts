import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal} from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private path = import.meta.env.NG_APP_URL

  private http = inject(HttpClient)
  private cacheService = inject(CachingService)

  private dataCache = signal<any[] | null>(null);

  constructor() { }

  public getDni(value:string):Observable<any> {
    const url = `${this.path}/reniec/${value}`
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

  public getRuc(value:string):Observable<any> {
    const url = `${this.path}/sunat/${value}`
    // ruc?numero=20601030013
    return this.http.get(url,{})
    .pipe(
      map(response => response),
      catchError(requestError => throwError(requestError))
    )
  }

  public getFullRuc(value:string):Observable<any> {
    const url = `${this.path}/full/sunat/${value}`
    // ruc?numero=20601030013
    return this.http.get(url)
    .pipe(
      map(response => response),
      catchError(requestError => throwError(requestError))
    )
  }

  getData() {
    if (this.dataCache()) {
      return new Observable(observer => {
        observer.next(this.dataCache()!);
        observer.complete();
      });
    }

    return this.http.get<any[]>(this.path).pipe(
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
