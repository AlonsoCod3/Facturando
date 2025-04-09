import { Component } from '@angular/core';
import { BasePagesComponent } from '../../base-pages/base-pages.component';

@Component({
  selector: 'app-home',
  imports: [BasePagesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title;
  titlePage = 'Bienvenida';

  constructor() {
    this.title = 'Bienvenido Usuari@';
  }

  ngOnInit(): void {}
}
