import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
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

  errorType = toSignal(
    this.route.queryParams.pipe(map(params => params['type']))
  )

  errorCode = toSignal(
    this.route.queryParams.pipe(map(params => params['code']))
  )
}
