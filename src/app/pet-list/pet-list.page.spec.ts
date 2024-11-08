import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.page.html',
  styleUrls: ['./pet-list.page.scss'],
})
export class PetListPage {
  mascotas: any[] = []; // Array para almacenar las mascotas registradas

  constructor(private router: Router, private location: Location) {
    // inicializar las mascotas con los datos almacenados en localStorage, si esq existen
    const storedPets = localStorage.getItem('mascotas');
    this.mascotas = storedPets ? JSON.parse(storedPets) : [];
  }

  editPet(index: number) {
    // Redirige a la pgina de editar perfil con los datos de la mascota a editar
    this.router.navigate(['/edit-profile'], { queryParams: { index } });
  }

  goBack(): void {
    // volver atras
    this.location.back();
  }
}
