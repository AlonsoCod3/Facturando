import { Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-boot-loader',
  imports: [],
  templateUrl: './boot-loader.component.html',
  styleUrl: './boot-loader.component.css'
})
export class BootLoaderComponent {
  loader = inject(LoaderService);
  private host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      void this.host.nativeElement.offsetHeight;
    });
  }
}
