import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, timer} from 'rxjs';
import { catchError, map, retry} from 'rxjs/operators';
import { cacheWithTTL } from '../utils/cache-with-ttl.util';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private API_RENIEC = import.meta.env.NG_APP_URL + "/verify"
  private productService = inject(ProductService);
  
  private checkCache = cacheWithTTL(
    () => this.http.get(this.API_RENIEC)
    .pipe(
      map((response:any)=> {
        // si la API responde
        if(response.status){
          console.log("Estado de API reniec:", response.status)
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


  initializeApp(): Observable<any> {
    return forkJoin({
      reniec: this.check(),
      products: this.productService.check(),
    })
  }

  check(): Observable<boolean> {
    return this.checkCache.get();
  }

}