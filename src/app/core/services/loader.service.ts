import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  loading = signal(false);
  initialLoading = signal(true);

  private previousOverflow = '';

  constructor() {
    effect(() => {
      if (this.loading() || this.initialLoading()) {
        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.previousOverflow;
      }
    });
  }

  show() { this.loading.set(true); }
  hide() { this.loading.set(false); }

  finishInitialLoad() { this.initialLoading.set(false); }
}