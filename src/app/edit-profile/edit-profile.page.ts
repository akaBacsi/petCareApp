import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class PetEditPage implements OnInit {
  petId: string = '';
  pet: any = {};
  newPhoto: any;
  newPhotoURL: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petId = id; 
      this.loadPetDetails();
    } else {
      console.error('No se encontró el ID de la mascota en la ruta.');
    }
  }

  goBack() {
    this.router.navigate(['/pet-list']);
  }

  loadPetDetails() {
    this.firestore.collection('pets').doc(this.petId).valueChanges().subscribe((data: any) => {
      this.pet = data;
    });
  }

  onFileSelected(event: any) {
    this.newPhoto = event.target.files[0];
  }

  async saveChanges() {
    if (this.newPhoto) {
      const filePath = `pets/${this.pet.ownerId}/${this.newPhoto.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.newPhoto);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.pet.fotoURL = url;
            this.updatePetData();
          });
        })
      ).subscribe();
    } else {
      this.updatePetData();
    }
  }

  private updatePetData() {
    this.firestore.collection('pets').doc(this.petId).update(this.pet).then(() => {
      console.log('Mascota actualizada con éxito');
      this.router.navigate(['/pet-list']);
    }).catch((error) => {
      console.error('Error al actualizar la mascota:', error);
    });
  }
}
