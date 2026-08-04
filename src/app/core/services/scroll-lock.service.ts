import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollLockService {

  constructor() { }

  private openDialogsCount = 0;
  private previousOverflow = '';

  lock(): void {
    if (this.openDialogsCount === 0) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    this.openDialogsCount++;
  }

  unlock(): void {
    this.openDialogsCount = Math.max(0, this.openDialogsCount - 1);
    if (this.openDialogsCount === 0) {
      document.body.style.overflow = this.previousOverflow;
    }
  }
}
