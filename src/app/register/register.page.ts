import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private location: Location // servicio Location para saber que pagina iba antes
  ) {}

  async registerUser() {
    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    try {
      const userCredential = await this.authService.register(this.email, this.password, this.username);
      console.log('Usuario registrado:', userCredential);
      this.showAlert('Éxito', 'Usuario registrado correctamente.');
      this.router.navigate(['/menu']); // ir al menu despues de registrarse
    } catch (error) {
      console.error('Error de registro:', error);
      this.showAlert('Error', 'No se pudo registrar el usuario. Por favor, intenta nuevamente.');
    }
  }
  

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.location.back(); // funcion para volver atrás
  }
}