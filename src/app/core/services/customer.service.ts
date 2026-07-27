import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout, tap, throwError } from 'rxjs';
import { Customer, CustomerForm } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private headers = new HttpHeaders()
  private apiUrl = import.meta.env.NG_APP_CUSTOMERS

  // Estado reactivo con signals
  private _customers = signal<Customer[]>([]);
  private _Cdni = signal<Customer[]>([]);
  private _Cruc = signal<Customer[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Signals públicos de solo lectura
  customers = this._customers.asReadonly();
  dni = this._Cdni.asReadonly();
  ruc = this._Cruc.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  total = computed(() => this._customers().length);

  getAll() {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Customer[]>(this.apiUrl).pipe(
      timeout(8000),
      tap((data) => {
        this._customers.set(data);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        const msg =
          err.name === 'TimeoutError'
            ? 'La solicitud tardó demasiado.'
            : err.status === 0
              ? 'Sin conexión al servidor.'
              : `Error ${err.status}`;
        this._error.set(msg);
        return throwError(() => err);
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

  getType(id: string) {
    return this.http.get<Customer[]>(`${this.apiUrl}/name/${id}`).pipe(
      timeout(8000),
      tap((data) => {
        if(id == "dni"){
          this._Cdni.set(data);
        }
        else {
          this._Cruc.set(data);
        }
        this._loading.set(false);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  create(payload: CustomerForm) {
    const url = `${this.apiUrl}/customers/`
    return this.http.post<Customer>(url, payload).pipe(
      timeout(8000),
      tap((newCustomer) => {
        this._customers.update((list) => [...list, newCustomer]);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  update(id: number, payload: CustomerForm) {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, payload).pipe(
      timeout(8000),
      tap((updated) => {
        this._customers.update((list) =>
          list.map((c) => (c.id === id ? updated : c))
        );
      }),
      catchError((err) => throwError(() => err))
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(8000),
      tap(() => {
        this._customers.update((list) => list.filter((c) => c.id !== id));
      }),
      catchError((err) => throwError(() => err))
    );
  }
}