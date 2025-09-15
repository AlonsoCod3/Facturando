import { JsonPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-new-product',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  enableVariants:boolean = false
  countVariants: number = 1

  productForm:FormGroup
  name:FormControl
  code:FormControl
  price:FormControl
  amount:FormControl
  category:FormControl

  loader = false
  responseCreated = false
  @ViewChild('create') dialog:ElementRef

  constructor(
    private serviceProduct: ProductService
  ){
    this.createControls()
    this.createForm()
  }

  createControls(){
    this.name = new FormControl("", Validators.required)
    this.code = new FormControl("001")
    this.price = new FormControl("", Validators.required)
    this.category = new FormControl("",Validators.required)
  }

  createForm(){
    this.productForm = new FormGroup({
      name: this.name,
      code: this.code,
      price: this.price,
      category: this.category,
      variants: new FormArray([
        new FormGroup({
          name: new FormControl(""),
          code: new FormControl("000"),
          price: new FormControl("")
        })
      ])
    })

  }

  enableVariant(){
    if(this.enableVariants){
      const nuevoArray = new FormArray([
        new FormGroup({
          name: new FormControl(""),
          code: new FormControl("000"),
          price: new FormControl("")
        })
      ])
      this.productForm.setControl('variants', nuevoArray)
      this.countVariants = 1
    }
    else {
      (this.variants.controls as FormGroup[]).map(control => {
        Object.keys(control.value).map(x => {
          control.get(x).setValidators(Validators.required)
          control.get(x).updateValueAndValidity()
        })
      })
    }	
    this.enableVariants = !this.enableVariants
  }
  get variants(): FormArray{
    return this.productForm.get('variants') as FormArray
  }

  createCode(){
    const code = this.countVariants.toString().padStart(3, '0');
    this.countVariants ++
    return code
  }

  addVariant(){
    let item = new FormGroup({
      name: new FormControl("", Validators.required),
      code: new FormControl(this.createCode()),
      price: new FormControl("", Validators.required)
    })
    this.variants.push(item)
  }

  removeVariant(index:number){
    console.log("remove item : ",index)
    this.variants.removeAt(index)
  }
  createProduct(){
    this.loader = true
    this.responseCreated = false
    this.dialog.nativeElement.showModal()
    const leido = {
      ...this.productForm.value,
      variants : this.enableVariants ? this.productForm.get('variants').value : []
    }
    leido["description"] = leido["category"]
    //corregir key 
    delete leido["category"]
    leido['price'] = Number(leido['price'])
    if (leido.variants){
      leido.variants.map(x => {
        x['price'] = Number(x['price'])
      })
    }

    this.serviceProduct.newProduct(leido).subscribe(
      data => {
        this.loader = false
        this.responseCreated = true
        console.log(data)
        console.log(this.responseCreated)
        this.productForm.reset()
      },
      error => {
        this.loader = false
        console.log(error)
        console.log(this.responseCreated)
      } 
    )
  }
}
