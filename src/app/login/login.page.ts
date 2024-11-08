import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  rememberSession: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Inicializar almacenamiento
    const savedUserId = await this.storage.get('userId');
    if (savedUserId) {
      this.router.navigate(['/menu']); // Redirigir si hay sesión activa
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
      await loading.dismiss();

      if (this.rememberSession && userCredential.user) {
        await this.storage.set('userId', userCredential.user.uid); // Guardar sesión si el checkbox está activo
      } else {
        await this.storage.remove('userId'); // Eliminar sesión si el checkbox está desactivado
      }

      await this.storage.set('username', userCredential.user?.displayName || 'Usuario'); // Guardar nombre de usuario
      this.router.navigate(['/menu']);
    } catch (error) {
      console.error('Error de autenticación:', error);
      await loading.dismiss();
      await this.showAlert('Error', 'Correo o contraseña incorrectos.');
    }
  }

  async loginWithFingerprint() {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
      if (!isAvailable) {
        await this.showAlert('Error', 'Autenticación biométrica no disponible.');
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: 'Para autenticación biométrica',
        title: 'Iniciar Sesión',
        description: 'Usa tu huella digital para iniciar sesión',
      });

      const savedUserId = await this.storage.get('userId');
      if (savedUserId) {
        this.router.navigate(['/menu']);
      } else {
        await this.showAlert('Error', 'No se encontró una cuenta registrada para la autenticación biométrica.');
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      await this.showAlert('Error', 'Autenticación biométrica fallida. Intenta nuevamente.');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
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
      console.error('Error al enviar correo de restablecimiento:', error);
      this.showAlert('Error', 'No se pudo enviar el correo de restablecimiento. Verifica tu correo e intenta de nuevo.');
    }
  }
}
