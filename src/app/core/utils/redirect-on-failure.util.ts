// redirect-on-failure.util.ts
import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable, tap, filter, take } from 'rxjs';

export function redirectOnGuardFailure(
  check$: Observable<boolean>,
  state: RouterStateSnapshot
): Observable<boolean> {
  const router = inject(Router);

  return check$.pipe(
    tap(result => {
      console.log("result", result)
      if (!result) {
        console.log('Guard bloqueó la navegación, redirigiendo con returnUrl:', state.url);
        router.navigate(['/404'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
}

export function redirectOnGuardFailureInit(
  check$: Observable<boolean>,
  state: RouterStateSnapshot
): Observable<boolean> {
  const router = inject(Router);

  return check$.pipe(
    filter(loading => !loading),
    tap(result => {
      if (!result) {
        router.navigate(['/404'], {
          queryParams: { returnUrl: state.url }
        });
      }
    }),
     take(1)
  );
}