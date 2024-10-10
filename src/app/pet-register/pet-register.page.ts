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
  tipoMascota: string = '';
  esRazaDesconocida: boolean = false;
  generoMascota: string = '';
  tieneAnios: boolean = false;

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

  onTipoMascotaChange() {
    this.rangoPesoMascota = ''; // Resetea el rango de peso cuando cambias el tipo de mascota
    this.edadAnios = 0;         // Restablecer edad en años
    this.edadMeses = 0;         // Restablecer edad en meses
    this.generoMascota = '';    // Restablecer genero
  }

  async registerPet() {
    if (!this.validateInputs()) return;

    const user = await this.authService.getCurrentUser();
    if (user) {
      const petData: any = {
        nombre: this.nombreMascota,
        raza: this.esRazaDesconocida ? 'Desconocida' : this.razaMascota,
        edadAnios: this.tieneAnios ? 0 : this.edadAnios, // Almacenar 0 si tiene 0 años
        edadMeses: this.edadMeses,
        rangoPeso: this.rangoPesoMascota,
        ownerId: user.uid,
        fotoURL: this.fotoURL,
        tipo: this.tipoMascota,
        genero: this.generoMascota,
      };

      if (this.selectedFile) {
        const filePath = `pets/${user.uid}/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                petData.fotoURL = url;
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

  private validateInputs(): boolean {
    if (!this.nombreMascota) {
      this.showAlert('Error', 'El nombre de la mascota es obligatorio.');
      return false;
    }

    if (!this.tipoMascota) {
      this.showAlert('Error', 'Debes seleccionar el tipo de mascota.');
      return false;
    }

    if (this.edadAnios < 0 || this.edadAnios > 20) {
      this.showAlert('Error', 'La edad en años debe estar entre 0 y 20.');
      return false;
    }

    if (this.edadMeses < 1 || this.edadMeses > 12) {
      this.showAlert('Error', 'La edad en meses debe estar entre 1 y 12.');
      return false;
    }

    if (!this.rangoPesoMascota) {
      this.showAlert('Error', 'Debes seleccionar el rango de peso.');
      return false;
    }

    if (!this.generoMascota) {
      this.showAlert('Error', 'Debes seleccionar el género.');
      return false;
    }

    return true;
  }

  private savePetData(petData: any) {
    this.firestore
      .collection('pets')
      .add(petData)
      .then(() => {
        this.showAlert('Éxito', 'Mascota registrada correctamente.');
        this.clearForm();
        this.router.navigate(['/pet-list']);
      })
      .catch(() => {
        this.showAlert('Error', 'Hubo un problema al registrar la mascota.');
      });
  }

  private clearForm() {
    // Reiniciar a sus valores iniciales para completar denuevo
    this.nombreMascota = '';
    this.razaMascota = '';
    this.edadAnios = 0;
    this.edadMeses = 0;
    this.rangoPesoMascota = '';
    this.fotoURL = '';
    this.selectedFile = null;
    this.tipoMascota = '';
    this.esRazaDesconocida = false;
    this.generoMascota = '';
    this.tieneAnios = false; // Reiniciar el checkbox
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
