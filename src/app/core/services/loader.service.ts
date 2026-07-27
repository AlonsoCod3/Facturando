import { signal } from '@angular/core';

export class LoaderService {
  loading = signal(false);

  show() { this.loading.set(true); }
  hide() { this.loading.set(false); }
}