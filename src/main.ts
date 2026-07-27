import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ResolveEnd, ResolveStart, Router, RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import routes from './routes';
import { LoaderService } from './app/core/services/loader.service';
import { LoaderComponent } from './app/components/loader/loader.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoaderComponent],
  template: `
  @if(loader.loading()){
  <app-loader />
  }
  <router-outlet />
  `,
})
export class App {

  constructor(private router: Router,public loader: LoaderService) {
    this.router.events.subscribe(event => {
      if (event instanceof ResolveStart) {
        this.loader.show();
      }

      if (event instanceof ResolveEnd) {
        this.loader.hide();
      }
    });
  }

}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    LoaderService
  ],
});
