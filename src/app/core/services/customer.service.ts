import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout, tap, throwError, Observable, from, concatMap, of, map, shareReplay } from 'rxjs';
import { Customer, CustomerForm, ReniecResponse, SunatResponse } from '../models/customer.model';
import { CachingService } from './caching.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private cacheService = inject(CachingService);
  private apiUrl = import.meta.env.NG_APP_CUSTOMERS + "/customers/"

  // Estado reactivo con signals
  private _customers = signal<Customer[]>([]);
  private _Cdni = signal<Customer[]|[]>([]);
  private _Cruc = signal<Customer[]|[]>([]);
  _message = signal<{type:string, data:{}} | null>(null);

  // Signals públicos de solo lectura
  customers = this._customers.asReadonly();
  dni = this._Cdni.asReadonly();
  ruc = this._Cruc.asReadonly();
  message = this._message.asReadonly()
  total = computed(() => this._customers().length);

  getAll() {

    return this.http.get<Customer[]>(this.apiUrl).pipe(
      timeout(8000),
      tap((data) => {
        this._customers.set(data);
      }),
      catchError((err) => {
        const msg =
          err.name === 'TimeoutError'
            ? 'La solicitud tardó demasiado.'
            : err.status === 0
              ? 'Sin conexión al servidor.'
              : `Error ${err.status}`;

        return throwError(() => msg);
      })
    );
  }

  getById(id: number) {
    return this.http.get<Customer[]>(`${this.apiUrl}/${id}`).pipe(
      timeout(8000),
      tap((data) => {
        this._customers.set(data);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  public getType(id: string, reset: boolean= false):Observable<[Customer]> {
    const url = `${this.apiUrl}name/${id}`
    const cached = this.cacheService.get(url);

    if (cached && !reset) {
      return cached
    }

    const request$ = this.http.get<[Customer]>(url).pipe(
      timeout(8000),
      tap((data) => {
        if(id == "dni"){
          this._Cdni.set(data);
        }
        else {
          this._Cruc.set(data);
        }
      }),
      catchError((err) => throwError(() => err)),
      shareReplay(1)
    )
    this.cacheService.set(url, request$)

    return request$
  }

  getTypes(): Observable<{tipo:string,data:[CustomerForm]}|{tipo:string,data:null}> {
    const tipos = ["ruc", "dni"]

    return from(tipos).pipe(
      concatMap((tipo:string) => this.getType(tipo).pipe(
        map(response => ({tipo,data:response})),
        catchError(err =>{
          console.log(`Error consultando ${tipo}:`, err)
          return of({tipo,data:null})
        })
      )), 
    )
  }

  create(payload: CustomerForm) {

    const url = this.apiUrl
    return this.http.post<CustomerForm>(url, payload).pipe(
      timeout(8000),
      tap((newCustomer) => {
        if(payload.docType=="dni"){
          this._Cdni.update(lista =>
            lista.map(item => item).concat(payload as Customer)
          );
        }
        else{
          this._Cruc.update((list) =>
            list.map(item => item).concat(payload as Customer)
          );
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  update(raw: Customer, payload:Partial<CustomerForm>) {
    const id = raw.id
    return this.http.patch<Customer>(`${this.apiUrl}${id}`, payload).pipe(
      timeout(8000),
      tap(() => {

        if(raw.docType=="dni"){
          this._Cdni.update((lista) =>
            lista.map((cliente) => (cliente.id === id ? { ...cliente, ...payload }: cliente))
          );
        }
        else{
          this._Cruc.update((list) =>
            list.map((c) => (c.id === id ? { ...c, ...payload }: c))
          );
        }
        
      }),
      catchError((err) => throwError(() => err))
    );
  }

  delete(raw: Customer) {
    const id = raw.id
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      timeout(8000),
      tap(() => {
        if(raw.docType=="dni"){
          this._Cdni.update((lista) =>
            lista.filter((cliente) => (cliente.id !== id ))
          );
        }
        else{
          this._Cruc.update((list) =>
            list.filter((cliente) => (cliente.id !== id))
          );
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  options(value:{type:string, data:{}}){
    this._message.set(value)
  }

  refreshType(url:string): void {
    this.cacheService.clear(url);
  }
}