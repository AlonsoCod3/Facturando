import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgClass, NgFor, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  public image: boolean = false;

  public NAME: string = 'Facturando';

  @Input() isOpen: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  //  url - icon - nombre - submenu

  public routes = [
    ['', 'fa fa-home', 'Dashboard'],
    // ['config', 'not', 'Configuración'],
    ['/tickets','fa fa-receipt','Boletas',[
      ['new','fa fa-plus','Nueva boleta']
    ]],
    ['products', 'fa fa-tags', 'Productos',[
      ['new','fa fa-plus','Crear Producto'],
      ['detail','fa fa-eye','Detalle de Producto'],
    ]]
  ];

  public sidebarToggle() {
    this.isOpen = !this.isOpen;
    this.toggleSidebar.emit(this.isOpen);
  }
}
