import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe   } from '@angular/common';

@Component({
  selector: 'app-new',
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  @ViewChild("dialog") dialog!:ElementRef
  @ViewChild("client_name") name!:ElementRef
  @ViewChild("client_address") address!:ElementRef

  client = {}
  variantes:any = {}
  products = [
    {
      id: 0,
      nombre: "Ceviche",
      precio: "22",
      cantidad: 1,
      total: 22
    }
  ]
  igv = new FormControl(10/100)

  totalAmount:number = 0


  p_name:FormControl = new FormControl("")
  p_price:FormControl = new FormControl("")
  p_amount:FormControl = new FormControl(1)

  constructor(
    private clientService:ClientService
  ){
    this.sumTotals()
  }

  sumTotals() {
    this.totalAmount = this.products.map(x => x.total).reduce((acc, current) => acc + current, 0)
  }

  firstLetter(event:any){
    let inputValue = event.target.value;
    event.target.value =  inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
  }
  numberPress(e:any){
    return /[0-9]/i.test(e.key)
  }
  subtractAmount(){
    if(Number(this.p_amount.value) != 0){
      this.p_amount.setValue(Number(this.p_amount.value) - 1);
    }
    
  }
  addAmount(){
    this.p_amount.setValue(Number(this.p_amount.value) + 1);
  }

  addItem(){
    console.log("Añadi unitem")
    let product = {
      id: this.products.length,
      nombre:this.p_name.value,
      precio:this.p_price.value,
      cantidad:this.p_amount.value,
      total: this.p_price.value * this.p_amount.value
    }
    this.products.push(product)
    this.sumTotals()
    this.dialog.nativeElement.close()
  }

  addFavorite() {
    console.log("añadido")
  }

  onInputDocument(event:any){
    if ( event.length === 8 ) {
      this.searchData(event)
    }
    else {
      this.name.nativeElement.value = ""
    }
  }
  searchData(value:string) {
    this.clientService.getDni(value)
    .subscribe(
      (x)=> {
        console.log(x)
        this.name.nativeElement.value = `${x.apellidoPaterno}  ${x.apellidoMaterno}, ${x.nombres}`
      }
    )
  }
}
