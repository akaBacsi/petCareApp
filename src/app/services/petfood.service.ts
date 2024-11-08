import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PetFoodService {
  private http!: HttpClient;

  constructor(private injector: Injector) {
    // Asigna `HttpClient` usando `Injector` después de un breve retraso para evitar el ciclo
    setTimeout(() => {
      this.http = this.injector.get(HttpClient);
    });
  }

  getProductDetails(barcode: string) {
    if (!this.http) {
      throw new Error('HttpClient is not initialized');
    }
    return this.http.get(`https://api-url.com/${barcode}`);
  }
}
