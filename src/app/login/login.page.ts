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

  async loginUser() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1000,
      spinner: 'circles'
    });

    await loading.present();

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Usuario autenticado:', userCredential.user);

      loading.onDidDismiss().then(() => {
        this.router.navigate(['/menu']);
      });
    } catch (error) {
      console.error('Error de autenticación:', error);
      await this.showAlert('Error', 'Correo o contraseña incorrectos.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
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
