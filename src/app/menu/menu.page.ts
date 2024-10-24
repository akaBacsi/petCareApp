import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController, IonCard } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DbService } from '../services/dbservice.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Observable } from 'rxjs/internal/Observable';

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
    private dbService: DbService,
    private faio: FingerprintAIO

  ) {}

  ngAfterViewInit() {
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
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      const userDetails$: Observable<any> = this.authService.getUserDetails(currentUser.uid);
      userDetails$.subscribe((user) => {
        if (user) {
          this.username = user.username;
        }
      });
    }
  }

  async registerFingerprint() {
    const user = await this.authService.getCurrentUser();

    if (user) {
        try {
            // Verifica si la huella digital es compatible
            await this.faio.isAvailable();

            // Inicia el escaneo de huella
            const result = await this.faio.show({
                title: 'Autenticación por Huella Digital',
                description: 'Escanea tu huella para iniciar sesión',
                disableBackup: true // Deshabilita la opción de respaldo
            });

            if (result) {
                // Almacena un marcador en SQLite para este usuario
                await this.dbService.addSession(user.email!, user.uid); // Guarda la sesión para identificar al usuario
            }
        } catch (error) {
            console.log('Error al registrar huella:', error);
        }
    }
}


  logout() {
    // Cerrar sesión y eliminar la persistencia local
    this.authService.logout();
    this.dbService.deleteSession(); // Eliminar la sesión de la base de datos SQLite
    this.router.navigate(['/login']);
  }
}
