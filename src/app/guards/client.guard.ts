import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
import { LoaderService } from '../core/services/loader.service';
import { redirectOnGuardFailure } from '../core/utils/redirect-on-failure.util';
import { ReniecService } from '../core/services/reniec.service';
import { CustomerService } from '../core/services/customer.service';

export const reniecCheckerGuard: CanActivateFn = (route, state) => {
  const reniecChecker = inject(ReniecService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return redirectOnGuardFailure(reniecChecker.check(), state)
};

export const clientCheckerGuard: CanActivateFn = (route, state) => {
  const clientChecker = inject(CustomerService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return redirectOnGuardFailure(clientChecker.check(), state)
};
