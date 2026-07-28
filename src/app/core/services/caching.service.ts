import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private cache = new Map<string, Observable<any>>()

  get(key:string):Observable<any> |null {
    return this.cache.get(key) ?? null
  }

  set(key:string , value:any):void{
    this.cache.set(key,value)
  }

  clear(key:string):void{
    this.cache.delete(key)
  }
}
