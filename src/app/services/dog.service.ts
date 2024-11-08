import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private apiUrl = 'https://dog.ceo/api';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las razas
  getAllBreeds(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/breeds/list/all`);
  }

  // Método para obtener imágenes de una raza específica
  getBreedImages(breed: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/breed/${breed}/images`);
  }
}
