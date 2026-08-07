import { Component, ElementRef, afterNextRender, effect, inject, signal } from '@angular/core';
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

  visibleText = signal<Record<string, string>>({});

  private typedIds = new Set<string>();
  private readonly charSpeedMs = 20;

  constructor() {
    afterNextRender(() => {
      void this.host.nativeElement.offsetHeight;
    });
    effect(() => {
      for (const entry of this.loader.bootLog()) {
        if (!this.typedIds.has(entry.id)) {
          this.typedIds.add(entry.id);
          this.typeLabel(entry.id, entry.label);
        }
      }
    });
  }


  private typeLabel(id: string, label: string): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
    if (prefersReducedMotion) {
      this.visibleText.update(map => ({ ...map, [id]: label }));
      return;
    }
 
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      this.visibleText.update(map => ({ ...map, [id]: label.slice(0, charIndex) }));
 
      if (charIndex >= label.length) {
        clearInterval(interval);
      }
    }, this.charSpeedMs);
  }
}
