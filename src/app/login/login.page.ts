import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { DbService } from '../services/dbservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  keepSession: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private faio: FingerprintAIO,
    private dbService: DbService
  ) {}

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async loginUser() {
    if (!this.email || !this.email.includes('@')) {
      await this.showAlert('Error', 'Por favor, ingresa un correo válido.');
      return;
    }

    if (!this.password || this.password.length < 6) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    await loading.present();

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      if (this.keepSession) {
        await this.dbService.addSession(this.email, userCredential.user?.uid!);
      } else {
        await this.dbService.deleteSession();
      }
      await loading.dismiss();
      this.router.navigate(['/menu']);
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Correo o contraseña incorrectos.');
    }
  }

  async loginWithFingerprint() {
    try {
      const userData = await this.dbService.getSession();
      if (!userData) {
        console.log('No se encontró huella registrada.');
        return;
      }

      const result = await this.faio.show({
        description: 'Autenticación con huella digital'
      });

      if (result) {
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

  async resetPassword() {
    if (!this.email) {
      this.showAlert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await this.authService.resetPassword(this.email);
      this.showAlert('Éxito', 'Se ha enviado un correo electrónico para restablecer tu contraseña.');
    } catch (error) {
      this.showAlert('Error', 'No se pudo enviar el correo de restablecimiento. Verifica tu correo e intenta de nuevo.');
    }
  }
}
