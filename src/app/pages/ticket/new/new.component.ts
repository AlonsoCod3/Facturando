import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-new',
  imports: [RouterLink],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  @ViewChild("dialog") dialog!:ElementRef

  @ViewChild("client_name") name!:ElementRef
  @ViewChild("client_address") address!:ElementRef

  variantes:any
  products:any

  constructor(
    private clientService:ClientService
  ){}

  client = {}

  addItem(){
    console.log("Añadi unitem")
    this.dialog.nativeElement.showModal()
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
