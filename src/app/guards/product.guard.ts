import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';
import { ProductService } from '../core/services/product.service';



export const productCheckerGuard: CanActivateFn = (route, state) => {
  const productChecker = inject(ProductService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return productChecker.check().pipe(
    finalize(() => loaderService.hide())
  )
};
