import { Component, ElementRef, ViewChild } from '@angular/core';
import { GridListComponent } from "../../components/grid-list/grid-list.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-clients',
  imports: [GridListComponent, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {

  @ViewChild("resultInput") inputResult:ElementRef<HTMLInputElement>

  // SearchField
  searchForm:FormGroup
  
  // CreateField
  createForm:FormGroup

  result:boolean = false
  resultado:string

  list_dni
  list_ruc

  metodos = {
    dni: (valor:string) => this.clientService.getDni(valor),
    ruc: (valor:string) => this.clientService.getRuc(valor)
  };

  constructor(
    private clientService:ClientService,
    private customerService:CustomerService
  ){
    this.createFormField()
    // this.customerService.getType("ruc").subscribe((data)=>{
    //   this.list_ruc = data
    // })
    // setTimeout(() => {
    //   this.customerService.getType("dni").subscribe((data)=>{
    //     this.list_dni = data
    //   })
    // }, 1000);
  }
  ngOnInit(){
    // search
    this.s_type.valueChanges.subscribe(()=>{
      this.s_doc.setValue("")
    })
    this.s_type.valueChanges.subscribe((data)=>{
      if(data == "ruc"){
        this.s_doc.clearValidators()
        this.s_doc.addValidators(Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11)
        ]))
        this.s_doc.updateValueAndValidity()
      }
      else{
        this.s_doc.clearValidators()
        this.s_doc.addValidators(Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(8)
        ]))
        this.s_doc.updateValueAndValidity()
      }
    })

    // create
    this.c_type.valueChanges.subscribe(()=>{
      this.c_doc.setValue("")
    })
    this.c_type.valueChanges.subscribe((data)=>{
      if(data == "ruc"){
        this.c_doc.clearValidators()
        this.c_doc.addValidators(Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]))
        this.c_doc.updateValueAndValidity()
      }
      else{
        this.c_doc.clearValidators()
        this.c_doc.addValidators(Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8)
        ]))
        this.c_doc.updateValueAndValidity()
      }
    })
  }

  searchDoc(){
    this.result = false
    setTimeout(() => {
      let values:any = this.limpiarObjeto(this.searchForm.value)
      console.log(values)
      this.result = true
      setTimeout(() => {
        this.resultado = "Eder Alonso, Ysla Castillo"
      }, 0);
    }, 1000);

    // this.ejecutar(this.s_type.value, this.s_doc.value)
    // .pipe(finalize(() => {this.inputResult.nativeElement.value = this.resultado }))
    // .subscribe(
    //   (x) => {
    //         console.log(x)
    //         this.result = true
    //         setTimeout(() => {
    //           if (this.s_type.value == "dni"){
    //             this.inputResult.nativeElement.value = `${x.first_last_name} ${x.second_last_name}, ${x.first_name}`
    //           }
    //           else{
    //             this.inputResult.nativeElement.value = `${x.razon_social}`
    //           } 
    //         }, 0);
    //   }
    // )
  }

  ejecutar(type: string, value) {
    return this.metodos[type]?.(value);
  }

  createClient(){
    if(this.createForm.valid){
      let values:any = this.limpiarObjeto(this.createForm.value)
      this.customerService.create(values).subscribe((data)=>{
        console.log(data)
      })
    }
  }

  limpiarObjeto = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value != null && value !== "")
    );
  };


  createFormField(){
    this.searchForm = new FormGroup(
      {
        name: new FormControl("", Validators.minLength(3)),
        search_type: new FormControl("dni"),
        numDoc: new FormControl("", Validators.compose([Validators.minLength(8),Validators.maxLength(8)]))
      }
    )
    this.createForm = new FormGroup(
      {
        name: new FormControl("", Validators.compose([Validators.required])),
        type: new FormControl("dni"),
        numDoc: new FormControl("", Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(8)])),
        phoneNumber: new FormControl("", Validators.compose([Validators.minLength(9), Validators.maxLength(9)]))
      }
    )
  }

  // search
  get s_name(){ return this.searchForm.get("name")}
  get s_type(){ return this.searchForm.get("search_type")}
  get s_doc(){ return this.searchForm.get("numDoc")}

  // create
  get c_name(){ return this.createForm.get("name")}
  get c_type(){ return this.createForm.get("type")}
  get c_doc(){ return this.createForm.get("numDoc")}
  get c_phone(){ return this.createForm.get("phone_Number")}
}
