import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

interface CardData {
  id?: string;
  name?: string;
  select?: string;
  value?: string;
  price?: string;
  docNumber?: string;
}

@Component({
  selector: 'app-card',
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  @Input("typo") typo : string = ""

  // Data only of card selectable
  @Input("typo-data") tData!: CardData
  @Input("card_ver") version!: boolean
  @Output("arrayClickable") arrayClickable: EventEmitter<any> = new EventEmitter();
  @Output("arrayUnclickable") arrayUnclickable: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  clickable(value:any,card:any,type="input"):void{
    type == "card" ? value.checked = !value.checked : null
    value.checked ? (card.select = true, this.getEmit(card,this.arrayClickable)) : (card.select = false, this.getEmit(card,this.arrayUnclickable))
  }
  getEmit(value:any, cost:any){
    cost.emit(value)
  }


}
