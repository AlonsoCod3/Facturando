import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new',
  imports: [RouterLink],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {

  addItem(){
    console.log("Añadi unitem")
  }

}
