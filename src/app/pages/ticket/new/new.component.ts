import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-new',
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  @ViewChild("dialog") dialog!:ElementRef
  @ViewChild("name_product") name_product!:ElementRef

  @ViewChild("client_name") name!:ElementRef
  @ViewChild("client_address") address!:ElementRef

  client = {}
  variantes:any = {}
  products:any
  igv = new FormControl(10/100)

  operationGrav:number = 0
  igvAmount:number = 0
  totalAmount:number = 0

  newItem!:FormGroup
  p_id:FormControl = new FormControl(0)
  p_name:FormControl = new FormControl("", Validators.required)
  p_price:FormControl = new FormControl("", Validators.required)
  p_amount:FormControl = new FormControl(1, Validators.required)
  p_total:FormControl = new FormControl(0)

  activarTemblor = false;

  constructor(
    private clientService:ClientService
  ){
    this.createFormGroup()
  }

  private sumTotals() {
    this.totalAmount = this.products.map((x:any) => x.total).reduce((acc:any, current:any) => acc + current, 0)
    this.operationGrav = this.totalAmount / (1 + this.igv.value!)
    this.igvAmount = ( this.totalAmount / (1 + this.igv.value!)) * this.igv.value!
  }

  public firstLetter(event:any){
    let inputValue = event.target.value;
    event.target.value =  inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
  }
  public numberPress(e:any){
    return /[0-9]/i.test(e.key)
  }

  public subtractAmount(){
    if(Number(this.p_amount.value) != 0){
      this.p_amount.setValue(Number(this.p_amount.value) - 1);
    }  
  }
  public addAmount(){
    this.p_amount.setValue(Number(this.p_amount.value) + 1);
  }

  private createFormGroup(){
    this.newItem = new FormGroup({
      id: this.p_id,
      nombre: this.p_name,
      precio: this.p_price,
      cantidad: this.p_amount,
      total: this.p_total,
    })
  }
  public openDialog(){
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
    }else{
      if((this.newItem.controls["id"].value !== null)){
        this.products[this.p_id.value].nombre = this.p_name.value,
        this.products[this.p_id.value].precio = this.p_price.value,
        this.products[this.p_id.value].cantidad = this.p_amount.value,
        this.products[this.p_id.value].total = this.p_price.value * this.p_amount.value
      }else if(this.products == undefined){
        let product = {
          id: 0,
          nombre:this.p_name.value,
          precio:this.p_price.value,
          cantidad:this.p_amount.value,
          total: this.p_price.value * this.p_amount.value
        }
        this.products = [product]
      }
      else{
        let product = {
          id: this.products.length,
          nombre:this.p_name.value,
          precio:this.p_price.value,
          cantidad:this.p_amount.value,
          total: this.p_price.value * this.p_amount.value
        }
        this.products.push(product)
      }
      this.sumTotals()
      this.dialog.nativeElement.close()
    }
  }
  public editItem(item:any){
    this.p_id.setValue(item.id)
    this.p_name.setValue(item.nombre)
    this.p_price.setValue(item.precio)
    this.p_amount.setValue(item.cantidad)
    this.p_total.setValue(item.total)
    this.newItem.markAllAsTouched()
    this.newItem.markAsDirty()
    this.dialog.nativeElement.showModal()
    this.name_product.nativeElement.focus()
  }
  public deleteItem(id:number){
    const indexDelete = this.products.findIndex((x:any)=> x.id === id)
    if (indexDelete !== -1) {
      // eliminar objeto
      this.products.splice(indexDelete, 1);
      // actualizar ids
      this.products.forEach((item:any, index:any) => {
        item.id = index
      });
      this.sumTotals()
    }
  }

  public addFavorite() {
    console.log("añadido")
  }

  public onInputDocument(event:any){
    if ( event.length === 8 ) {
      this.searchData(event)
    }
    else {
      this.name.nativeElement.value = ""
    }
  }

  private searchData(value:string) {
    this.clientService.getDni(value)
    .subscribe(
      (x)=> {
        console.log(x)
        this.name.nativeElement.value = `${x.first_last_name}  ${x.second_last_name}, ${x.first_name}`
      }
    )
  }
}
