import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage {
  email: string = ''; // Variable para almacenar el correo electrónico del usuario

  constructor(private alertCtrl: AlertController) {}

  subscribe() {
    const subject = 'Gracias por la aplicación';
    const body = 'Estoy agradecido y le doy 5 estrellas a la aplicación.';

    // Validar que el correo tenga un formato válido
    if (this.validateEmail(this.email)) {
      // Crear la URL mailto con el asunto y el cuerpo del mensaje
      const mailtoLink = `mailto:petcare@app.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Abrir el enlace mailto
      window.location.href = mailtoLink;

      // Mostrar mensaje de éxito
      this.showAlert('¡Gracias por tu mensaje de agradecimiento!', 'Tu correo ha sido enviado correctamente.');
    } else {
      this.showAlert('Correo inválido', 'Por favor, ingresa un correo electrónico válido.');
    }
  }

  // Función para validar el formato del correo electrónico
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Mostrar alerta
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
