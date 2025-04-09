import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  imports: [],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css',
})
export class TopNavbarComponent {
  public image: boolean = false;

  @Input() isOpen: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  public sidebarToggle() {
    this.isOpen = !this.isOpen;
    this.toggleSidebar.emit(this.isOpen);
  }
}
