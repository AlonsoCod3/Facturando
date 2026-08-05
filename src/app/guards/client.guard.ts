import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
import { finalize} from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';
import { redirectOnGuardFailure } from '../core/utils/redirect-on-failure.util';
import { ReniecService } from '../core/services/reniec.service';

export const clientCheckerGuard: CanActivateFn = (route, state) => {
  const reniecChecker = inject(ReniecService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return redirectOnGuardFailure(reniecChecker.check(), state).pipe(
    finalize(() => loaderService.hide())
  )
};
