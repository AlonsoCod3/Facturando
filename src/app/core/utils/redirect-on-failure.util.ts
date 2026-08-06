// redirect-on-failure.util.ts
import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable, tap} from 'rxjs';

export function redirectOnGuardFailure(
  check$: Observable<boolean>,
  state: RouterStateSnapshot
): Observable<boolean> {
  const router = inject(Router);

  return check$.pipe(
    tap(result => {
      if (!result) {
        console.log('Guard bloqueó la navegación, redirigiendo con returnUrl:', state.url);
        router.navigate(['/404'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
}