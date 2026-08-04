import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-grid-list',
  imports: [CardComponent, ReactiveFormsModule, NgClass, NgxSkeletonLoaderModule],
  templateUrl: './grid-list.component.html',
  styleUrl: './grid-list.component.css'
})
export class GridListComponent {
  @Input() sectionTitle!:string
  @Input() data!:any[]
  @Input() form:string = "list"
  @Input() gridList:boolean = true
  @Input() customer:boolean = false


  @Input() loader:{load:boolean, error:boolean, message:boolean} = 
  {
    load:false,
    error:false,
    message:false
  }
  @Output("refresh") refreshCustomer:EventEmitter<any> = new EventEmitter();

  @ViewChild("cardNow") card!:ElementRef;

  type!:FormControl
  section!:{type:string, cad:boolean}
  
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

  refresh(){
    this.refreshCustomer.emit(true)
  }
  
}
