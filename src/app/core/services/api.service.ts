import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private dataCache = signal<any[] | null>(null);

  private API_URL = import.meta.env.NG_APP_PRODUCT

  getData() {
    if (this.dataCache()) {
      return new Observable(observer => {
        observer.next(this.dataCache()!);
        observer.complete();
      });
    }

    return this.http.get<any[]>(this.API_URL + "/verify").pipe(
      tap(posts => this.dataCache.set(posts))
    );
  }

  setCache(data: any) {
    this.dataCache.set(data);
  }

  clearCache() {
    this.dataCache.set(null);
  }
}