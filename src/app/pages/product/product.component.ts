import { Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product',
  imports: [DecimalPipe, RouterLink, NgxSkeletonLoaderModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products:any = []
  seleccionar:boolean= false

  loader:boolean = true
  errorLoader:boolean = false
  messageError:boolean = false

  constructor(
    private productService: ProductService
  ){}
  ngOnInit(){
    setTimeout(() => {
      this.getProducts()
    }, 1000);
      
  }

  private getProducts(){
    this.productService.getProducts()
      .subscribe({
        next:(data)=> {
          console.log(data)
          this.products = data
          this.loader = false
        },
        error:(err) => {
        if (err != 404){
          this.messageError = true
        }
        console.log(err);
        this.loader = false
        this.errorLoader = true
      }
    })
  }

}
