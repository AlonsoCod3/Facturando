import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal} from '@angular/core';
import { Observable, catchError, shareReplay, timer, of, throwError } from 'rxjs';
import { retry, map } from 'rxjs/operators';
import { CachingService } from './caching.service';
import { cacheWithTTL } from '../utils/cache-with-ttl.util';
import { ReniecResponse, SunatResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  private path = import.meta.env.NG_APP_URL

  private http = inject(HttpClient)
  private cacheService = inject(CachingService)

  private dataCache = signal<any[] | null>(null);

  constructor() { }

  public getDni(value:string): Observable<ReniecResponse> {
    const url = `${this.path}/reniec/${value}`
    const cachedResponse = this.cacheService.get(url);

    if (cachedResponse) return cachedResponse

    const reque = this.http.get<ReniecResponse>(url)
      .pipe(
        map(response =>response),
        catchError(requestError => {
          this.cacheService.clear(url)
          return throwError(() => requestError)
        }),
        shareReplay(1)
      )
    this.cacheService.set(url, reque)
    return reque
  }

  public getRuc(value:string): Observable<SunatResponse> {
    const url = `${this.path}/sunat/${value}`
    const cache = this.cacheService.get(url)

    if(cache) return cache

    const reque = this.http.get<SunatResponse>(url)
    .pipe(
      map(response => response),
      catchError(requestError => {
        this.cacheService.clear(url)
        return throwError(() => requestError)
      }), shareReplay(1)
    )
    this.cacheService.set(url, reque)
    return reque
  }

  private API_RENIEC = this.path + "/verify"
  
  private checkCache = cacheWithTTL(
    () => this.http.get(this.API_RENIEC)
    .pipe(
      map((response:any)=> {
        // si la API responde
        if(response.status){
          // console.log("Estado de API reniec:", response.status)
          return true
        }
        throw new Error('API aún no está lista')
      }),
      retry({
        count: 10,
        delay: (error, retryCount) => timer(3000),
        resetOnSuccess: true,
      }), catchError((error)=>{
        // console.log('Se agotaron los reintentos, la API no respondió a tiempo');
        return of(false);
      }),

    ),
    300000
  )

  check(): Observable<boolean> {
    return this.checkCache.get();
  }

}
