import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new',
  imports: [RouterLink],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  @ViewChild("dialog") dialog?:ElementRef

  constructor(){}

  addItem(){
    console.log("Añadi unitem")
    this.dialog?.nativeElement.setAttribute("open", "")
  }
  addFavorite() {
    console.log("añadido")
  }
  onInputDocument(event:any){
    if ( event.length === 8 ) {
      // this.searchData(event)
      console.log("buscando DNI")
    }
  }
  searchData(value:string) {
    // this.consultDNI(value).subscribe(
    //   (x) => {
    //     console.log(x)
    //   }
    // )
  }
}
