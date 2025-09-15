import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-product',
  imports: [],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent {

  id: string | null = null;
  detail: boolean = false

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    console.log(this.route.snapshot)
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      console.log('ID del producto:', this.id);
      this.detail = true
    } else {
      console.log('No hay ID de producto');
    }
  }

}
