import { Injectable, signal, effect } from '@angular/core';

export interface BootLogEntry {
  id: string;
  label: string;
  status: 'pending' | 'done' | 'error';
}

@Injectable({ providedIn: 'root' })
export class LoaderService {
  loading = signal(false);
  initialLoading = signal(true);
  initSucceeded = signal(true);
  
  bootLog = signal<BootLogEntry[]>([]);

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

  logStart(id:string, label:string) {
    this.bootLog.update(list => [...list, { id, label, status: "pending"}])
  }

  logDone(id:string , ok:boolean = true ) {
    this.bootLog.update(list => list.map(entry => entry.id === id ? {...entry, status: ok ? "done": "error" }: entry))
  }
}