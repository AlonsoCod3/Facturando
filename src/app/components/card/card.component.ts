import { JsonPipe, NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, OnInit, ViewChild, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  @Input("typo") typo : string = ""

  // Data only of card selectable
  @Input("typo-data") tData : {value:string, price:string,id:string,select:boolean}
  @Output("arrayClickable") arrayClickable: EventEmitter<any> = new EventEmitter();
  @Output("arrayUnclickable") arrayUnclickable: EventEmitter<any> = new EventEmitter();

  constructor() { }


  ngOnInit(): void {
  }

  clickable(value,card,type="input"):void{
    type == "card" ? value.checked = !value.checked : null
    value.checked ? (card.select = true, this.getEmit(card,this.arrayClickable)) : (card.select = false, this.getEmit(card,this.arrayUnclickable))
  }
  getEmit(value, cost){
    cost.emit(value)
  }


}
