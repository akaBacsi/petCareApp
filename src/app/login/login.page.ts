import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx'; // Importar plugin de huella digital
import { DbService } from '../services/dbservice.service'; // Importar servicio para SQLite

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  keepSession: boolean = false; // Agregada para manejar el checkbox

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private faio: FingerprintAIO, // Añadir huella digital
    private dbService: DbService // Para manejar persistencia en SQLite
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

      // Guardar sesión en SQLite si el checkbox está marcado
      if (this.keepSession) {
        await this.dbService.addSession(this.email, userCredential.user?.uid!);
      } else {
        await this.dbService.deleteSession(); // Método para limpiar la sesión si no se quiere mantener
      }

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

  // Autenticación con huella digital
  async loginWithFingerprint() {
    try {
      // Verificar si hay sesión guardada en SQLite
      const userData = await this.dbService.getSession();

      if (!userData) {
        console.log('No se encontró huella registrada.');
        return;
      }

      // Mostrar escaneo de huella digital
      const result = await this.faio.show({
        description: 'Autenticación con huella digital'
      });

      if (result) {
        // Redirigir al menú si la huella es válida
        console.log('Autenticación exitosa con huella digital.');
        this.router.navigate(['/menu']);
      }
    } catch (error) {
      console.error('Error en autenticación por huella:', error);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.location.back();
  }

  // Restablecer contraseña
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
