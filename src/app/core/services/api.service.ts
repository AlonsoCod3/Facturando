import { inject, Injectable } from '@angular/core';
import { Observable, from, of, map} from 'rxjs';
import { concatMap, delay, tap, toArray} from 'rxjs/operators';
import { ProductService } from './product.service';
import { LoaderService } from './loader.service';
import { ReniecService } from './reniec.service';

interface BootStep {
  id: string;
  label: string;
  run: () => Observable<any>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private loader = inject(LoaderService)
  private reniecService = inject(ReniecService);
  private productService = inject(ProductService);

  initializeApp(): Observable<any> {
    const results: Record<string, any> = {}

    const steps: BootStep[] = [
      {
        id: 'reniec',
        label: 'Conectando con RENIEC...',
        run: () => this.reniecService.check(),
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
          delay(500),
          concatMap(() =>
            step.run().pipe(
              map(data => (data)),
              tap(res => {results[step.id] = res})
            )
          ),
          tap(res => this.loader.logDone(step.id, res))
        )
      ), 
      toArray(),
      map(() => results)
    )
  }

}