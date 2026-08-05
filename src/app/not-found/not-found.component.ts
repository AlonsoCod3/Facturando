import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject ,signal } from '@angular/core';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  private route = inject(ActivatedRoute)
  returnUrl = signal<string>('/');
  isReloading = signal(false);

  constructor(){
    this.route.queryParams.subscribe(params => {
      this.returnUrl.set(params['returnUrl'] || '/');
    });
  }

  errorType = toSignal(
    this.route.queryParams.pipe(map(params => params['type']))
  )

  errorCode = toSignal(
    this.route.queryParams.pipe(map(params => params['code']))
  )

  reintentar() {
    // Recarga completa: reinicia toda la app, incluyendo cachés en memoria
    this.isReloading.set(true);
    window.location.href = this.returnUrl();
  }
}
