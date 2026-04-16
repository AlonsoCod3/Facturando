import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket',
  imports: [CardComponent, RouterLink],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  @ViewChild("card")  tarjetaAfter!:ElementRef;

  card_ver:boolean = true

  type_boleta_1:string = "list"
  type_boleta_2:string = "grid"
  type_boleta_3:string = "grid"
  
  section1 = { type:"list",cad: true }
  section2 = { type:"grid",cad: false }
  section3 = { type:"grid",cad: false }

  ngAfterViewInit() {
  }
  controlCard(card:any){
    card.classList.contains("expand") ?
    card.classList.remove("expand") :
    card.classList.add("expand")
  }
  changeData(type:string, card:any, bole:any) {
    console.log(card)
    if(type == "grid") {
      card.childNodes[0].classList.remove("c-height")
      card.classList.remove("expand")
      card.childNodes[0].classList.add("c-width")
      this[bole].type = "grid"
      this[bole].cad = false
    }
    if(type == "list") {
      card.childNodes[0].classList.remove("c-width")
      card.childNodes[0].classList.add("c-height")
      // bole = "list"
      this[bole].type = "list"
      this[bole].cad= true
    }
  }
}
