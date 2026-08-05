import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import routes from './routes';
import { LoaderService } from './app/core/services/loader.service';
import { LoaderComponent } from './app/components/loader/loader.component';
import { ApiService } from './app/core/services/api.service';
import { BootLoaderComponent } from './app/components/boot-loader/boot-loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoaderComponent, BootLoaderComponent],
  template: `
  @if (loader.initialLoading()) {
  <app-boot-loader />
} @else if (loader.loading()) {
  <app-loader />
}
  <router-outlet />
  `,
})
export class App {
  public loader = inject(LoaderService)
  private apisInit = inject(ApiService)
  constructor(
  ) {
    this.apisInit.initializeApp().subscribe({
      next: (results) => {
      },
      error: (err) => {
      },
      complete: () => {
        setTimeout(() =>{
          this.loader.finishInitialLoad();
        }, 1000)
      }
    })
  }

}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    LoaderService
  ],
});
