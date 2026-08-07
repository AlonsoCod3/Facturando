import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
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
  <app-boot-loader /> <!-- loader de pantalla completa, solo la primera vez -->
} @else if (loader.loading()) {
  <app-loader /> <!-- loader normal de navegación entre rutas -->
}
  <router-outlet />
  `,
})
export class App {
  public loader = inject(LoaderService)
  private apisInit = inject(ApiService)
  private router = inject(Router)

  constructor(
  ) {
    this.apisInit.initializeApp().subscribe({
      next: (results) => {
        console.log('APIs iniciales cargadas', results);
        const huboFallo = Object.values(results).some(valor => valor === false);
        this.loader.initSucceeded.set(!huboFallo);
      },
      error: (err) => {
        console.error('Error inicializando la app:', err);
        this.loader.initSucceeded.set(false);
      },
      complete: () => {
          this.loader.finishInitialLoad();
      }
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("pase por end")
        this.loader.hide();
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
