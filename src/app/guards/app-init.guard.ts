import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { LoaderService } from '../core/services/loader.service';
import { redirectOnGuardFailureInit } from '../core/utils/redirect-on-failure.util';

export const appInitGuard: CanActivateFn = (route, state) => {
  const loader = inject(LoaderService);

  return redirectOnGuardFailureInit(toObservable(loader.initialLoading), state)
};