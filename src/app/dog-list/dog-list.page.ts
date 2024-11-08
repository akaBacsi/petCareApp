import { Component, OnInit } from '@angular/core';
import { DogService } from '../services/dog.service';

@Component({
  selector: 'app-dog-list',
  templateUrl: './dog-list.page.html',
  styleUrls: ['./dog-list.page.scss'],
})
export class DogListPage implements OnInit {
  breeds: string[] = [];
  dogImages: string[] = [];
  selectedBreed: string = ''; // Raza seleccionada

  constructor(private dogService: DogService) {}

  ngOnInit() {
    this.loadBreeds();
  }

  loadBreeds() {
    this.dogService.getAllBreeds().subscribe(
      (data) => {
        this.breeds = Object.keys(data.message); // Asegurarse de cargar las razas correctamente
      },
      (error) => {
        console.error('Error al cargar razas:', error);
      }
    );
  }

  loadImagesForBreed(breed: string) {
    this.selectedBreed = breed; // Establecer la raza seleccionada
    this.dogService.getBreedImages(breed).subscribe(
      (data) => {
        this.dogImages = data.message; // Asegurarse de cargar las imágenes correctamente
      },
      (error) => {
        console.error('Error al cargar imágenes de la raza:', error);
      }
    );
  }

  viewImage(image: string) {
    window.open(image, '_blank'); // Abrir la imagen en una nueva pestaña
  }
}
