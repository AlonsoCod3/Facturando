import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  @ViewChild("client_name") name!:ElementRef
  @ViewChild("client_address") address!:ElementRef

  variantes:any
  products:any

  p_name:FormControl = new FormControl("")
  p_price:FormControl = new FormControl("")
  p_description:FormControl = new FormControl("")

  constructor(
    private clientService:ClientService
  ){}

  firstLetter(event:any){
    let inputValue = event.target.value;
    event.target.value =  inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
  }
  numberPress(e:any){
    return /[0-9]/i.test(e.key)
  }

  client = {}

  addItem(){
    console.log("Añadi unitem")
    let product = {
      nombre:this.p_name.value,
      precio:this.p_price.value,
      descripcion:this.p_description.value
    }
    console.log(product)
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
