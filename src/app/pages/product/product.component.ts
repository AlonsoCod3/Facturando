import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  private destroyRef = inject(DestroyRef);

  products:any = []
  seleccionar:boolean= false

  loader:boolean = true
  errorLoader:boolean = false
  messageError:boolean = false

  constructor(
    private productService: ProductService
  ){}
  ngOnInit(){
      this.getProducts()
  }

  private getProducts(){
    this.productService.getProducts()
    // activar solo si necesito eliminar la peticion cuando salgo de pagina
    // .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:(data)=> {
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
