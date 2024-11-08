import { Component, OnInit } from '@angular/core';
import { PetFoodService } from '../services/petfood.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  barcode: string = '123456'; // Aquí establece un valor de prueba o asegúrate de que se inicialice correctamente
  product: any; // Define la propiedad product

  constructor(private petFoodService: PetFoodService) {}

  ngOnInit() {
    this.getProductDetails();
  }

  getProductDetails() {
    if (this.barcode) {
      this.petFoodService.getProductDetails(this.barcode).subscribe(
        (data) => {
          this.product = data;
          console.log('Datos del producto:', data); // Agrega esta línea para depurar
        },
        (error) => {
          console.error('Error al obtener detalles del producto:', error);
        }
      );
    }
  }
}
