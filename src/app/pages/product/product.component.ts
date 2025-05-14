import { Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [DecimalPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products:any = []

  constructor(
    private productService: ProductService
  ){}
  ngOnInit(){
      this.productService.getProducts()
      .subscribe(
        (x)=> {
          console.log(x)
          this.products = x
        }
      )
  }

}
