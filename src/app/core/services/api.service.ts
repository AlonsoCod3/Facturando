import { inject, Injectable } from '@angular/core';
import { Observable, from, of, map} from 'rxjs';
import { concatMap, delay, tap, toArray} from 'rxjs/operators';
import { ProductService } from './product.service';
import { LoaderService } from './loader.service';
import { ReniecService } from './reniec.service';
import { CustomerService } from './customer.service';

interface BootStep {
  id: string;
  label: string;
  run: () => Observable<any>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private loader = inject(LoaderService)
  private reniecService = inject(ReniecService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);

  initializeApp(): Observable<any> {
    const results: Record<string, any> = {}

    const steps: BootStep[] = [
      {
        id: 'reniec',
        label: 'Conectando con API RENIEC...',
        run: () => this.reniecService.check(),
      },
      {
        id: 'clients',
        label: 'Conectando con Base de Datos de Clientes...',
        run: () => this.customerService.check(),
      },
      {
        id: 'products',
        label: 'Cargando catálogo de productos...',
        run: () => this.productService.check()
      },
    ]

    return from(steps).pipe(
      concatMap( (step, index) =>
        of(null).pipe(
          tap(() => this.loader.logStart(step.id,step.label)),
          delay(1000),
          concatMap(() =>
            step.run().pipe(
              map(data => (data)),
              tap(res => {
                results[step.id] = res
                this.loader.logDone(step.id, res)
              }),
              delay(500),
            )
          ),
        )
      ), 
      toArray(),
      map(() => results)
    )
  }

}