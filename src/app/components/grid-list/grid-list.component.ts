import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-grid-list',
  imports: [CardComponent, ReactiveFormsModule, NgClass],
  templateUrl: './grid-list.component.html',
  styleUrl: './grid-list.component.css'
})
export class GridListComponent {
  @Input() sectionTitle:string
  @Input() data:[]
  @Input() form:string = "list"
  @Input() gridList:boolean = true
  @Input() customer:boolean = false

  @ViewChild("cardNow") card!:ElementRef;

  type:FormControl
  section:{type:string, cad:boolean}
  
  ngOnInit(){
    this.type = new FormControl(this.form)
    this.section = { type:this.form ,cad: this.form == "list" ? true:false }

    this.type.valueChanges.subscribe(value => {
      if(value == "grid"){
        this.card.nativeElement.classList.remove("expand")
        this.section.type = value
        this.section.cad = false
      }
      else{
        this.section.type = value
        this.section.cad = true
  
      }
    })
  }
  constructor(){
  }

  controlCard(card:any){
    card.classList.contains("expand") ?
    card.classList.remove("expand") :
    card.classList.add("expand")
  }
  
}
