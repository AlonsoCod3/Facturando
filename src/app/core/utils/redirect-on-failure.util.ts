// redirect-on-failure.util.ts
import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, tap} from 'rxjs';

export function redirectOnGuardFailure(
  check$: Observable<boolean>,
  state: RouterStateSnapshot
): Observable<boolean|UrlTree> {
  const router = inject(Router);

  return check$.pipe(
    tap(result => { result ? true :
        console.log('Guard bloqueó la navegación, redirigiendo con returnUrl:', state.url);
    }),
    map(res => {
        if(res) {return true}
        return router.createUrlTree(['/404'], {
            queryParams: {
              returnUrl: state.url
            }
          })
      }
    )


  );
}