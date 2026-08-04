import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { CustomerService } from '../../core/services/customer.service';

interface CardData {
  id?: string;
  name?: string;
  select?: string;
  value?: string;
  price?: string;
  docNumber?: string;
  docType?: string;
  phone?: string;
}

@Component({
  selector: 'app-card',
  imports: [NgClass, NgxSkeletonLoaderComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  customerService = inject(CustomerService)

  @Input("typo") typo : string = ""

  // Data only of card selectable
  @Input("typo-data") tData!: CardData
  @Input("card_ver") version!: boolean
  @Output("arrayClickable") arrayClickable: EventEmitter<any> = new EventEmitter();
  @Output("arrayUnclickable") arrayUnclickable: EventEmitter<any> = new EventEmitter();

  customerOptions:boolean = false
  constructor() { }

  ngOnInit(): void {
  }
  // daily
  clickable(value:any,card:any,type="input"):void{
    type == "card" ? value.checked = !value.checked : null
    value.checked ? (card.select = true, this.getEmit(card,this.arrayClickable)) : (card.select = false, this.getEmit(card,this.arrayUnclickable))
  }
  // Customer Options
  clickOptions(value:any,card:any):void{
    value.checked = !value.checked
    this.customerOptions = value.checked
  }
  clickEdit(){
    this.customerService.options({
      type: "edit",
      data: this.tData
    })
  }
  clickDelete(){
    this.customerService.options({
      type: "delete",
      data: this.tData
    })
  }
  clickInvoice(){
    this.customerService.options({
      type: "invoice",
      data: this.tData
    })
  }

  getEmit(value:any, cost:any){
    cost.emit(value)
  }


}
