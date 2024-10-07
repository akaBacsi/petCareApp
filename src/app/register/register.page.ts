import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular'; // Agregamos LoadingController
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
    private loadingController: LoadingController, // Inyectamos LoadingController
    private location: Location
  ) {}

  async registerUser() {
    if (!this.validateInputs()) return;

    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();

    try {
      const userCredential = await this.authService.register(this.email, this.password, this.username);
      console.log('Usuario registrado:', userCredential);
      this.showAlert('Éxito', 'Usuario registrado correctamente.');
      await loading.dismiss(); // Ocultar cargando cuando se completa el registro
      this.router.navigate(['/menu']);
    } catch (error) {
      console.error('Error de registro:', error);
      await loading.dismiss(); // Ocultar cargando si hay un error
      this.handleRegistrationError(error);
    }
  }

  validateInputs(): boolean {
    if (!this.username || this.username.length < 3) {
      this.showAlert('Error', 'El nombre de usuario debe tener al menos 3 caracteres.');

      //falta agregar que deban ser caracteres y no permita numeros ni caracteres especiales 

      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailPattern.test(this.email)) {
      this.showAlert('Error', 'Por favor, ingresa un correo válido.');
      return false;
    }

    if (this.password.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return false;
    }

    return true;
  }

//MANEJO DE ERRORES FIREBASE
  handleRegistrationError(error: any) {
    if (error.code === 'auth/email-already-in-use') {
      this.showAlert('Error', 'Este correo ya está registrado. Por favor, usa otro.');
    } else if (error.code === 'auth/weak-password') {
      this.showAlert('Error', 'La contraseña es demasiado débil. Por favor, elige una más segura.');
    } else {
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
    this.location.back();
  }
}
