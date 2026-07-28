import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import routes from './routes';
import { LoaderService } from './app/core/services/loader.service';
import { LoaderComponent } from './app/components/loader/loader.component';
import { ApiService } from './app/core/services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoaderComponent],
  template: `
  @if (loader.initialLoading()) {
  <app-loader /> <!-- loader de pantalla completa, solo la primera vez -->
} @else if (loader.loading()) {
  <app-loader /> <!-- loader normal de navegación entre rutas -->
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
        console.log('APIs iniciales cargadas');
      },
      error: (err) => {
        console.error('Error inicializando la app:', err);
      },
      complete: () => {
        this.loader.finishInitialLoad();
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
