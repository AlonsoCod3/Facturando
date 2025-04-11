import { Component, EventEmitter, Output } from '@angular/core';
import { BasePagesComponent } from '../../../base-pages/base-pages.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [BasePagesComponent, NgFor, NgIf, CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {
  @Output() values:EventEmitter<any> = new EventEmitter<any>()

  readonly url:string = ""

  title:string = "Configuración General";
  titlePage = 'Configuración';

  table:boolean = false

  colorPicker:Array<string>= ["#1098F7","#B89E97","#DECCCC"]
  pickColor:string= "#aa1f2b"

  selectColor (color:string){
    this.pickColor = color
  }

  options:Array<any> = []//Opciones switch para activar

  targetData:any
  parent:any

  valueColumns:any

  createColumn(input:any){
    if(Number(input.value)){
      let numberOfColumns = Number(input.value)
      if(this.valueColumns){
        if(numberOfColumns > this.valueColumns.length){ //mayor
          let newValue = (numberOfColumns - this.valueColumns.length)
          let newArray = this.valueColumns
          for(let row = 0; row < newValue; row ++){
            newArray.push("Column")
          }
          this.valueColumns = newArray
        }
        else if(numberOfColumns < this.valueColumns.length){ //menor
           let newValue = (this.valueColumns.length - numberOfColumns)
           for( let row = 0; row < newValue; row ++){
            this.valueColumns.pop()
           }
        }
      }
      else {
        let rowo:Array<string> = []
        for(let row = 0; row < numberOfColumns; row ++){
          rowo.push("Column")
        }
        this.valueColumns = rowo
      }
    }
  }

  editColumn(button:any, input:any, index:any){
    button.setAtributte("hidden", "")
    input.removeAtributte("hidden")
    input.removeAtributte("disabled")
    input.value = this.valueColumns[index]
    input.focus()
    input.select()
  }

  setColumn(button:any, input:any, index:any){
    this.valueColumns[index] = input.value
    input.setAtributte("hidden","")
    input.setAtributte("disabled", "")
    button.removeAtributte("hidden")

  }

  constructor() { 

  }

  ngOnInit(): void {}

  onDrag(e:any){}
  onDragStart(e:any){}
  onDragEnd(e:any){}

}
