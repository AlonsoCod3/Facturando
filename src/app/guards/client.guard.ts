import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';
import { ApiService } from '../core/services/api.service';

export const clientCheckerGuard: CanActivateFn = (route, state) => {
  const apiChecker = inject(ApiService);
  const loaderService = inject(LoaderService);

  loaderService.show();

  return apiChecker.check().pipe(
    finalize(() => loaderService.hide())
  )
};
