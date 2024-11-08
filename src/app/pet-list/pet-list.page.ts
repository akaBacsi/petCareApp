import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.page.html',
  styleUrls: ['./pet-list.page.scss'],
})
export class PetListPage implements OnInit {
  mascotas: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPets();
  }

  ionViewWillEnter() {
    this.loadPets();
  }

  loadPets() {
    this.authService.getCurrentUser().then((user) => {
      if (user) {
        this.firestore
          .collection('pets', ref => ref.where('ownerId', '==', user.uid))
          .snapshotChanges()
          .subscribe((snapshot) => {
            this.mascotas = snapshot.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as object)
              };
            });
          });
      }
    });
  }

  deletePet(petId: string) {
    this.firestore
      .collection('pets')
      .doc(petId)
      .delete()
      .then(() => {
        console.log('Mascota eliminada con éxito');
        //FALTA AGREGAR PARA QUE APAREZCA UN SI O NO
        //SI DESEO ELIMINAR A LA MASCOTA O NO
        this.loadPets(); 
      })
      .catch((error) => {
        console.error('Error al eliminar mascota:', error);
      });
  }

  editPet(petId: string) {
    console.log('Editar mascota con ID:', petId);
    // AQUI HAY QUE COMPLETAR LA LOGICA PARA EDITAR LA MASCOTA

    //NO REALIZADO AUN


    /*  *******************************     */
  }

  goBack() {
    this.router.navigate(['/menu']);
  }
}
