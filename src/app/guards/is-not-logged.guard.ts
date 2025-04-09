import { CanMatchFn } from '@angular/router';

export const isNotLoggedGuard: CanMatchFn = (route, state) => {
  return false;
};
