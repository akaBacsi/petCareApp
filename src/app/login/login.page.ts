import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // Método para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para iniciar sesión
  async loginUser() {
    // Validación de correo
    if (!this.email || !this.email.includes('@')) {
      await this.showAlert('Error', 'Por favor, ingresa un correo válido.');
      return;
    }

    // Validación de contraseña
    if (!this.password || this.password.length < 6) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Mostrar el cargando mientras se realiza la petición
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
      cssClass: 'custom-loading'
    });

    await loading.present();

    try {
      // Realizar la autenticación con Firebase
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Usuario autenticado:', userCredential.user);

      // Cerrar el cargando y redirigir a la página principal
      await loading.dismiss();
      this.router.navigate(['/menu']);
    } catch (error) {
      console.error('Error de autenticación:', error);
      // Cerrar el cargando y mostrar el mensaje de error
      await loading.dismiss();
      await this.showAlert('Error', 'Correo o contraseña incorrectos.');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.location.back();
  }

  // restablecer contraseña
  async resetPassword() {
    if (!this.email) {
      this.showAlert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await this.authService.resetPassword(this.email);
      this.showAlert('Éxito', 'Se ha enviado un correo electrónico para restablecer tu contraseña.');
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      this.showAlert('Error', 'No se pudo enviar el correo de restablecimiento. Verifica tu correo e intenta de nuevo.');
    }
  }
}
