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
  controlCard(card:any){
    card.classList.contains("expand") ?
    card.classList.remove("expand") :
    card.classList.add("expand")
  }
  changeData(type:string, card:any) {
    if(type == "grid") {
      // this.tarjetaAfter.nativeElement.childNodes[0].classList.remove("c-height")
      // this.tarjetaAfter.nativeElement.classList.remove("expand")
      // this.tarjetaAfter.nativeElement.childNodes[0].classList.add("c-width")
      card.childNodes[0].classList.remove("c-height")
      card.classList.remove("expand")
      card.childNodes[0].classList.add("c-width")
    }
    if(type == "list") {
      // this.tarjetaAfter.nativeElement.childNodes[0].classList.remove("c-width")
      // this.tarjetaAfter.nativeElement.classList.add("expand")
      // this.tarjetaAfter.nativeElement.childNodes[0].classList.add("c-height")
      card.childNodes[0].classList.remove("c-width")
      card.childNodes[0].classList.add("c-height")
    }
  }
}
