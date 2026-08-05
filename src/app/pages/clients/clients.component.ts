import { Component, ElementRef, ViewChild, inject, OnInit, effect, AfterViewInit } from '@angular/core';
import { GridListComponent } from "../../components/grid-list/grid-list.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReniecService } from '../../core/services/reniec.service';
import { CustomerService } from '../../core/services/customer.service';
import { JsonPipe, NgClass } from '@angular/common';
import { Customer, CustomerForm, CustomerSearchResult, ReniecResponse, SunatResponse } from '../../core/models/customer.model';
import { Observable } from 'rxjs'
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ScrollLockService } from '../../core/services/scroll-lock.service';

interface SearchForm {
  search_type: FormControl<'dni' | 'ruc'>;
  docNumber: FormControl<string>;
}

interface CreateForm {
  name: FormControl<string>;
  docType: FormControl<'dni' | 'ruc'>;
  docNumber: FormControl<string>;
  phoneNumber: FormControl<string>;
}

@Component({
  selector: 'app-clients',
  imports: [GridListComponent, ReactiveFormsModule, NgClass, NgxSkeletonLoaderComponent, JsonPipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, AfterViewInit {

  @ViewChild("resultInput") inputResult!: ElementRef
  @ViewChild("editDialog") editDialog!: ElementRef
  @ViewChild("deleDialog") deletDialog!: ElementRef
  @ViewChild("errorDialog") errorDialog!: ElementRef
  @ViewChild("addDialog") addDialog!: ElementRef
  @ViewChild("loading") loadDialog!: ElementRef
  @ViewChild("anyDialog") anyResponse!: ElementRef

  private reniecService = inject(ReniecService)
  private customerService = inject(CustomerService)
  private scrollLock = inject(ScrollLockService);

  isOpen: boolean = false
  isEditOpen: boolean = false
  editingCustomer: Customer | null = null

  searchForm!: FormGroup<SearchForm>
  createForm!: FormGroup<CreateForm>
  editForm!: FormGroup<CreateForm>
  delCustomer!:any

  loader_dialog: boolean = false
  responseCreated: boolean = false
  resultado!: string
  searchError: string | null = null

  // para component cards
  loader_ruc:{load:boolean, error:boolean, message:boolean} = 
  {
    load:false,
    error:false,
    message:false
  }
  loader_dni:{load:boolean, error:boolean, message:boolean} = 
  {
    load:false,
    error:false,
    message:false
  }

  lastSearchResult: CustomerSearchResult | null = null

  list_dni:CustomerForm[] = []
  list_ruc:CustomerForm[] = []

  metodos: Record<'dni' | 'ruc', (valor: string) => Observable<any>> = {
    dni: (valor: string) => this.reniecService.getDni(valor),
    ruc: (valor: string) => this.reniecService.getRuc(valor)
  };

  constructor() {
    this.createFormField()
    this.options()
  }

  ngOnInit() {
    this.setupSearchValidation()
    this.setupCreateValidation()
    this.loadCustomers()
  }

  ngAfterViewInit(){
    this.setupDialog(this.inputResult);
    this.setupDialog(this.editDialog);
    this.setupDialog(this.deletDialog);
    this.setupDialog(this.errorDialog);
    this.setupDialog(this.addDialog);
    this.setupDialog(this.loadDialog);
    this.setupDialog(this.anyResponse);
  }

  options(){
    effect(() => {
      const data = this.customerService.message()
      if(data){
        switch (data.type) {
          case "edit":
            this.openEditForm(data.data)
            break;
          case "delete":
            this.deleteDialog(data.data)
            break;
          case "invoice":
            console.log(data.data)
            break;
        
          default:
            break;
        }

      }
    })
  }

  private loadCustomers() {
    this.loader_ruc.load = this.loader_dni.load = true
    this.loader_ruc.error = this.loader_dni.error = false
    this.loader_ruc.message = this.loader_dni.message = false

    this.customerService.getTypes()
    .subscribe({
      next:({tipo,data})=>{
        if(!data) {
          switch (tipo) {
            case 'ruc':
              this.loader_ruc.load = false
              this.loader_ruc.error = true
              this.loader_ruc.message = true
              break;
            case 'dni':
              this.loader_dni.load = false
              this.loader_dni.error = true
              this.loader_dni.message = true
              break;
          }
          return
        }
        switch (tipo) {
          case 'ruc':
            this.list_ruc = data;
            this.loader_ruc.load = false
            break;
          case 'dni':
            this.list_dni = data;
            this.loader_dni.load = false
            break;
        }
      },
      error:(err) => {
        console.log("Error en customerComponent: ",err)
      }
    })
  }

  private setupSearchValidation() {
    this.s_type?.valueChanges.subscribe(() => {
      this.s_doc?.setValue("")
    })
    this.s_type?.valueChanges.subscribe((data) => {
      if (data == "ruc") {
        this.s_doc?.clearValidators()
        this.s_doc?.addValidators(([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]))
      } else {
        this.s_doc?.clearValidators()
        this.s_doc?.addValidators(([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8)
        ]))
      }
      this.s_doc?.updateValueAndValidity()
    })
  }

  private setupCreateValidation() {
    this.c_type?.valueChanges.subscribe(() => {
      this.c_doc?.setValue("")
    })
    this.c_type?.valueChanges.subscribe((data) => {
      if (data == "ruc") {
        this.c_doc?.clearValidators()
        this.c_doc?.addValidators(([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]))
      } else {
        this.c_doc?.clearValidators()
        this.c_doc?.addValidators(([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8)
        ]))
      }
      this.c_doc?.updateValueAndValidity()
    })
  }

  searchDoc() {
    if (!this.searchForm.valid) return

    const type = this.s_type?.value
    const doc = this.s_doc?.value
    if (!type || !doc) return

    this.searchError = null
    this.loadDialog.nativeElement.showModal()
    this.scrollLock.lock()

    if(doc == this.lastSearchResult?.docNumber && type == this.lastSearchResult.docType){
      this.loadDialog.nativeElement.close()
      this.inputResult.nativeElement.showModal()
      this.searchForm.reset()
      return
    }
    this.lastSearchResult = null

    this.metodos[type](doc).subscribe({
      next: (response: any) => {
        let searchResult: CustomerSearchResult

        if (type === 'dni') {
          const data = response as ReniecResponse
          const fullName = `${data.first_last_name} ${data.second_last_name}, ${data.first_name}`
          this.resultado = fullName
          searchResult = {
            docType: 'dni',
            docNumber: doc,
            name: fullName,
            raw: data
          }
        } else {
          const data = response as SunatResponse
          this.resultado = data.razon_social
          searchResult = {
            docType: 'ruc',
            docNumber: doc,
            name: data.razon_social,
            raw: data
          }
        }

        this.lastSearchResult = searchResult
        this.searchForm.reset()
      },
      error: (err: any) => {
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock( )
        this.inputResult.nativeElement.showModal()
        this.searchError = err.status === 0
          ? 'Sin conexión al servidor.'
          : err.status === 404
            ? 'No se encontraron datos para este documento.'
            : `Error ${err.status} al consultar.`
      },
      complete: ()=>{
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.inputResult.nativeElement.showModal()
      }
    })
  }
  cancelSearch(){
    this.inputResult.nativeElement.close()
    this.lastSearchResult = null
  }

  manualCreate(){
    const type = this.s_type?.value
    const doc = this.s_doc?.value
    
    if (!type || !doc){
      (!confirm(`Error al asignar valores, porfavor ingrese datos manualmente`) )
      return
    }

    this.c_type?.setValue(type)
    this.c_doc?.setValue(doc)

    this.isOpen = true
    this.searchForm.reset()
  }

  agregarCliente() {
    if (!this.lastSearchResult) return
    this.inputResult.nativeElement.close()
    this.scrollLock.lock()
    this.loadDialog.nativeElement.showModal()

    const result = this.lastSearchResult
    const payload: CustomerForm = {
      name: result.name,
      docType: result.docType,
      docNumber: result.docNumber,
      phone: "",
    }

    this.customerService.create(payload).subscribe({
      next: () => {
        this.resultado = `"${payload.name}" se añadio exitosamente.`
        this.lastSearchResult = null
        if(payload.docType == "dni"){
          this.list_dni = this.customerService.dni()
        }
        else{
          this.list_ruc = this.customerService.ruc()
        }
      },
      error: (err) => {
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.searchError = 'Error al guardar el cliente. Intente nuevamente.'
        this.errorDialog.nativeElement.showModal()
      },
      complete:() =>{
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.addDialog.nativeElement.showModal()
      }
    })
  }

  createClient() {
    if (!this.createForm.valid) {
      // verificar como mostrar este error sin popUp
      return
    }
    const values = this.limpiarObjeto(this.createForm.value) as unknown as CustomerForm

    this.scrollLock.lock()
    this.loadDialog.nativeElement.showModal()

    this.customerService.create(values).subscribe({
      next: () => {
        this.resultado = `"${values.name}" se añadio exitosamente.`
        this.createForm.reset()
        if(values.docType == "dni"){
          this.list_dni = this.customerService.dni()
        }
        else{
          this.list_ruc = this.customerService.ruc()
        }
      },
      error:(err) => {
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.searchError = 'Error al guardar el cliente. Intente nuevamente.'
        this.errorDialog.nativeElement.showModal()
      },
      complete:() => {
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.addDialog.nativeElement.showModal()
      }
    })

  }

  openEditForm(customer:any) {
    this.editDialog.nativeElement.showModal()
    this.scrollLock.lock()

    this.editingCustomer = customer
    this.isEditOpen = true

    this.editForm = new FormGroup<CreateForm>({
      name: new FormControl(customer.name, { nonNullable: true, validators: [Validators.required] }),
      docType: new FormControl({value:customer.docType, disabled:true}),
      docNumber: new FormControl({value:customer.docNumber, disabled:true}),
      phoneNumber: new FormControl(customer.phoneNumber, { nonNullable: true, validators: [Validators.minLength(9), Validators.maxLength(9)] })
    })
  }

  saveEdit() {
    this.editDialog.nativeElement.close()
    this.loadDialog.nativeElement.showModal()
    this.scrollLock.lock()

    if (!this.editForm.valid || !this.editingCustomer) return

    const values = this.limpiarObjeto(this.editForm.value) as Partial<CustomerForm>

    this.customerService.update(this.editingCustomer, values).subscribe({
      next: () => {
        this.resultado = "Se actualizaron correctamente los datos"
        
        if(this.editingCustomer?.docType == "dni"){
          this.list_dni = this.customerService.dni()
        }
        else{
          this.list_ruc = this.customerService.ruc()
        }
      },
      error: (err) => {
        this.loadDialog.nativeElement.close()
        console.log(err)
        this.resultado = err
        this.scrollLock.lock()
        this.errorDialog.nativeElement.showModal()
      },
      complete:() =>{
        this.editingCustomer = null
        this.isEditOpen = false
        this.loadDialog.nativeElement.close()
        this.scrollLock.lock()
        this.anyResponse.nativeElement.showModal()
      }
    })
  }

  deleteDialog(customer: any) {
    this.deletDialog.nativeElement.showModal()
    this.scrollLock.lock()

    this.delCustomer = customer
  }

  deleteCustomer(customer: any) {
    this.deletDialog.nativeElement.close()
    this.loadDialog.nativeElement.showModal()
    this.scrollLock.lock()

    this.customerService.delete(customer).subscribe({
      next: (data) => {
        this.loadDialog.nativeElement.close()
  
        this.resultado = "Se elimino satisfactoriamente el cliente"
        
        if(this.editingCustomer?.docType == "dni"){
          this.list_dni = this.customerService.dni()
        }
        else{
          this.list_ruc = this.customerService.ruc()
        }
        this.scrollLock.lock()
        this.anyResponse.nativeElement.showModal()
      },
      error: (err) => {
        this.loadDialog.nativeElement.close()
        console.log(err)
        this.resultado = err
        this.scrollLock.lock()
        this.errorDialog.nativeElement.showModal()
      }
    })
  }

  limpiarObjeto(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value != null && value !== "")
    )
  }

  createFormField() {
    this.searchForm = new FormGroup<SearchForm>({
      search_type: new FormControl('dni', { nonNullable: true }),
      docNumber: new FormControl('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(8), Validators.maxLength(8)] })
    })

    this.createForm = new FormGroup<CreateForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      docType: new FormControl('dni', { nonNullable: true }),
      docNumber: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)] }),
      phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.minLength(9), Validators.maxLength(9)] }),
    })
  }

  toogleCrear() {
    this.isOpen = !this.isOpen
  }

  reloadCustomerType(tipo:any){
switch (tipo) {
      case "ruc":
        this.loader_ruc.load = true
        this.loader_ruc.error = false
        this.loader_ruc.message = false

        this.customerService.getType(tipo, true).subscribe({
          next:(value)=>{
            this.list_ruc = value
            this.loader_ruc.load = false
            this.loader_ruc.error = false
            this.loader_ruc.message = false
          },
          error:(err)=>{
            this.loader_ruc.load = false
            this.loader_ruc.error = true
            this.loader_ruc.message = true

            console.log(err)
          }
        })
        break;
      
      case "dni":
        this.loader_dni.load = true
        this.loader_dni.error = false
        this.loader_dni.message = false

        this.customerService.getType(tipo, true).subscribe({
          next:(value)=>{
            this.list_dni = value
            this.loader_dni.load = false
            this.loader_dni.error = false
            this.loader_dni.message = false
          },
          error:(err)=>{
            this.loader_dni.load = false
            this.loader_dni.error = true
            this.loader_dni.message = true

            console.log(err)
          }
        })
        break;
        
      default:
        break;
    }
  }

  private setupDialog(dialogRef: ElementRef<HTMLDialogElement>) {
    dialogRef.nativeElement.addEventListener('close', () => {
      this.scrollLock.unlock();
    });
  }

  // search client
  get s_type() { return this.searchForm.get('search_type') }
  get s_doc() { return this.searchForm.get('docNumber') }

  // create client
  get c_name() { return this.createForm.get('name') }
  get c_type() { return this.createForm.get('docType') }
  get c_doc() { return this.createForm.get('docNumber') }
  get c_phone() { return this.createForm.get('phoneNumber') }

  // edit client
  get e_name() { return this.editForm?.get('name') }
  get e_phone() { return this.editForm?.get('phoneNumber') }
}