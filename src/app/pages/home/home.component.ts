import { Component } from '@angular/core';
import { BasePagesComponent } from '../../base-pages/base-pages.component';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-home',
  imports: [BasePagesComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  titlePage = 'Bienvenido Alonso';

  constructor() {}

  ngOnInit(): void {}
}
