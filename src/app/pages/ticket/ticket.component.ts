import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-ticket',
  imports: [CardComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  @ViewChild("card")  tarjetaAfter!:ElementRef;

  ngAfterViewInit() {
  }
  controlCard(){
    this.tarjetaAfter.nativeElement.classList.contains("expand") ?
    this.tarjetaAfter.nativeElement.classList.remove("expand") :
    this.tarjetaAfter.nativeElement.classList.add("expand")
  }
}
