import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pet-register',
  templateUrl: './pet-register.page.html',
  styleUrls: ['./pet-register.page.scss'],
})
export class PetRegisterPage {
  nombreMascota: string = '';
  razaMascota: string = '';
  edadAnios: number = 0;
  edadMeses: number = 0;
  rangoPesoMascota: string = '';
  fotoURL: string = '';
  selectedFile: any;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private alertController: AlertController
  ) {}

  goBack() {
    this.router.navigate(['/menu']); 
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async registerPet() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      const petData = {
        nombre: this.nombreMascota,
        raza: this.razaMascota,
        edadAnios: this.edadAnios,
        edadMeses: this.edadMeses,
        rangoPeso: this.rangoPesoMascota,
        ownerId: user.uid,
        fotoURL: this.fotoURL,
      };

      if (this.selectedFile) {
        const filePath = `pets/${user.uid}/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                petData.fotoURL = url; // Asigna la URL a los datos de la mascota
                this.savePetData(petData);
              });
            })
          )
          .subscribe();
      } else {
        this.savePetData(petData);
      }
    } else {
      this.showAlert('Error', 'Usuario no autenticado.');
    }
  }

  private savePetData(petData: any) {
    this.firestore
      .collection('pets')
      .add(petData)
      .then(() => {
        this.showAlert('Éxito', 'Mascota registrada correctamente.');
        this.router.navigate(['/pet-list']);
      })
      .catch(() => {
        this.showAlert('Error', 'Hubo un problema al registrar la mascota.');
      });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
