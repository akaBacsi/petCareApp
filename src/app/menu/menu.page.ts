import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController, ToastController } from '@ionic/angular';
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
  @ViewChild('animatedCard', { read: ElementRef }) cardElement!: ElementRef<HTMLIonCardElement>;
  username: string = '';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  async ngAfterViewInit() {
    if (this.cardElement?.nativeElement) {
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
    } else {
      console.warn('El elemento cardElement no está disponible en el DOM');
    }
  }

  async ionViewWillEnter() {
    this.username = (await this.storage.get('username')) || 'Usuario';
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
          await this.storage.set('userId', currentUser.uid);
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
    this.storage.remove('userId');
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

  onItemClick() {
  }
  
  onItemKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onItemClick();
    }
  }
  
  onButtonKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.logout();
    }
  }
}
