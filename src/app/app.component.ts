import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from './services/dbservice.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private dbService: DbService) {
    this.initializeApp();
  }

  async initializeApp() {
    const userData = await this.dbService.getSession();
    if (userData) {
      // Redirigir al menú si hay sesión guardada
      this.router.navigate(['/menu']);
    } else {
      // Si no hay sesión guardada, redirigir a login
      this.router.navigate(['/login']);
    }
  }
}
