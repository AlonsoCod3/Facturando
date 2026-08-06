import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { LoaderService } from '../core/services/loader.service';
import { filter, take, map } from 'rxjs';
import { redirectOnGuardFailure } from '../core/utils/redirect-on-failure.util';

export const appInitGuard: CanActivateFn = (route, state) => {
  const loader = inject(LoaderService);

  const check = toObservable(loader.initialLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(()=> loader.initSucceeded())
  )

  return redirectOnGuardFailure(check, state)
};