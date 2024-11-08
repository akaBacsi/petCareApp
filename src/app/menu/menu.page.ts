import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController, IonCard, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements AfterViewInit {
  @ViewChild(IonCard, { read: ElementRef }) cardElement!: ElementRef<HTMLIonCardElement>;
  username: string = '';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  async ngAfterViewInit() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.cardElement.nativeElement)
      .duration(3000)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(0.9)' },
        { offset: 1, transform: 'scale(1)' },
      ])
      .iterations(Infinity);

    animation.play();
  }

  async ionViewWillEnter() {
    this.username = (await this.storage.get('username')) || 'Usuario'; // Obtener nombre de usuario desde storage
  }

  async registerFingerprint() {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
      if (isAvailable) {
        await NativeBiometric.verifyIdentity({
          reason: 'Para autenticación biométrica',
          title: 'Registrar Huella Digital',
          description: 'Usa tu huella digital para registrar',
        });

        const currentUser = await this.authService.getCurrentUser();
        if (currentUser) {
          await this.storage.set('userId', currentUser.uid); // Almacenar el userId para autenticar con huella
          await this.showToast('Huella digital registrada con éxito');
        }
      } else {
        this.showToast('Autenticación biométrica no disponible');
      }
    } catch (error) {
      console.error('Error al registrar huella digital:', error);
      this.showToast('Error al registrar la huella digital');
    }
  }

  logout() {
    this.authService.logout();
    this.storage.remove('userId'); // Limpiar almacenamiento de sesión
    this.router.navigate(['/login']);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
