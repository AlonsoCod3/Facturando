import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CachingService } from './caching.service';
import { Observable, shareReplay, tap, throwError, timer, of } from 'rxjs';
import { catchError, map, retry} from 'rxjs/operators';
import { cacheWithTTL } from '../utils/cache-with-ttl.util';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient)
  private pathProducts = import.meta.env.NG_APP_PRODUCT
  private cacheService = inject(CachingService)
  private checkCache = cacheWithTTL(
    () => this.http.get(`${this.pathProducts}/verify`)
      .pipe(
            map((response:any)=> {
              // si la API responde
              if(response){
                console.log("Estado de API Products:", response)
                return true
              }
              throw new Error('API aún no está lista')
            }),
            retry({
              count: 10,
              delay: (error, retryCount) => timer(3000),
              resetOnSuccess: true,
            }), catchError((error)=>{
              console.log('Se agotaron los reintentos, la API no respondió a tiempo');
              return of(false);
            }),
          ),
    300000
  )

  constructor() { }

  public getProducts():Observable<any> {
    const url = `${this.pathProducts}/products/`
    const cached = this.cacheService.get(url);
    
    if (cached){
      console.log("respuesta cacheada")
      return cached
    }
    console.log('No hay caché, creando la petición HTTP.');
    const request$ =  
    this.http.get(url)
    .pipe(
      tap({
        subscribe: () => console.log('Alguien se suscribió, la petición se está disparando ahora'),
        next: (response) => console.log('Respuesta recibida de la API:', response),
        error: (err) => console.log('Error en la petición:', err),
      }),
        map(response => response),
        catchError(requestError=> {
          this.cacheService.clear(url)
          return throwError(() => requestError)
        }),
        shareReplay(1)
      )
      this.cacheService.set(url, request$)
      console.log('Observable guardado en caché (aún sin ejecutar)');
      return request$
  }

  public newProduct(body:any):Observable<any> {
    const url = `${this.pathProducts}/products/`

      return this.http.post(url, body)
      .pipe(
        map(response => response),
        catchError(requestError=>throwError(requestError))
      )
  }

  check(): Observable<boolean> {
    return this.checkCache.get();
  }

  refreshProducts(): void {
    this.checkCache.clear();
  }
}
