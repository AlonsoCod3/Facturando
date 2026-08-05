import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';
import { ProductService } from '../core/services/product.service';
import { redirectOnGuardFailure } from '../core/utils/redirect-on-failure.util';



export const productCheckerGuard: CanActivateFn = (route, state) => {
  const productChecker = inject(ProductService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return redirectOnGuardFailure(productChecker.check(), state).pipe(
    finalize(() => loaderService.hide())
  )
};
