import { Observable, timer, shareReplay, catchError } from 'rxjs';

export function cacheWithTTL<T>(
  sourceFactory: () => Observable<T>,
  ttlMs: number = 60000
) {
  let cached$: Observable<T> | undefined;

  return {
    get(): Observable<T> {
      if (cached$) {
        return cached$;
      }

      cached$ = sourceFactory().pipe(
        shareReplay(1),
        catchError(err => {
          cached$ = undefined;
          throw err;
        })
      );

      timer(ttlMs).subscribe(() => cached$ = undefined);

      return cached$;
    },
    clear(): void {
      cached$ = undefined;
    }
  };
}