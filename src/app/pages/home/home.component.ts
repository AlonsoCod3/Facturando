import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { JsonPipe } from '@angular/common';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CardComponent,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  titlePage = 'Bienvenido Alonso';

  @ViewChild("trash") trashButton : ElementRef;
  @ViewChild("plus") plusButton : ElementRef;

  @ViewChild("dialog") dialog!:ElementRef
  @ViewChild("name_product") name_product!:ElementRef

  newItem!:FormGroup
  nameP:FormControl = new FormControl("",Validators.required)
  priceP:FormControl = new FormControl(0,Validators.required)

  activarTemblor = false;


  items: any = [
    {value:"Ceviche",price:"50", id:"0", select: false},
    {value:"Apanado",price:"30", id:"1", select: false},
    {value:"Sudado",price:"40", id:"2", select: false}
  ]
  finalItems: Array<string> = []
  actionDeleted: boolean = false
  
  contentItemSelect:number = 0

  constructor() {
    this.createFormGroup()
  }

  public pressAdd(){
    this.newItem.reset()
    this.dialog.nativeElement.showModal()
    this.name_product.nativeElement.focus()

  }
  public addItem(){
    if(this.newItem.invalid){
      this.activarTemblor = true;
      this.newItem.markAllAsTouched();
      setTimeout(() => {
        this.activarTemblor = false
      }, 1000);
      return;
    }
    else{
      let item = this.newItem.getRawValue()
      item.select = false
      item.id = this.items.length
      this.items.push(item)
      this.dialog.nativeElement.close()
    }
  }
  public selectItems(value){
    this.finalItems.push(value)
    this.contentItemSelect = this.finalItems.length
  }
  public unSelectItem(value){
    let indexToDelete = this.finalItems.findIndex((item:any) => {return (value == item)})
    this.finalItems.splice(indexToDelete,1)
    this.contentItemSelect = this.finalItems.length
  }
  public deleteSelectables(){
    this.finalItems.forEach(
      (item:any)=>{
        let deleteIndex = this.items.findIndex((item2:any)=>{return(item2 == item)})
        this.items[deleteIndex].select = false
        this.items.splice(deleteIndex,1)
      }
    )
    this.finalItems = []
    this.contentItemSelect = 0
  }

  public numberPress(e:any){
    return /[0-9]/i.test(e.key)
  }

  private createFormGroup(){
    this.newItem = new FormGroup({
      value: this.nameP,
      price: this.priceP
    })
  }

  ngOnInit(): void {}
}
