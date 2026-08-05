import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, of} from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { ProductService } from './product.service';
import { LoaderService } from './loader.service';
import { ReniecService } from './reniec.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private reniecService = inject(ReniecService);
  private productService = inject(ProductService);
  private loader = inject(LoaderService)

  initializeApp(): Observable<any> {
    return forkJoin({
      reniec: this.reniecService.check().pipe(
        tap({
          subscribe:() => this.loader.logStart("reniec",'Conectando con RENIEC...'),
          next:(re) => {
            if(!re){
              this.loader.logDone('reniec', false);
            }
            else{
              this.loader.logDone("reniec",true)
            }
          }
        }),
        catchError( err => {
          this.loader.logDone('reniec', false);
          return of(false);
        })
      ),
      products: this.productService.check().pipe(
        tap({
          subscribe:() => this.loader.logStart("products",'Conectando con Productos...'),
          next:(re) => {
            if(!re){
              this.loader.logDone('products', false);
            }
            else{
              this.loader.logDone("products",true)
            }
          }
        }),
        catchError( err => {
          this.loader.logDone('products', false);
          return of(false);
        })
      ),
    })
  }

}