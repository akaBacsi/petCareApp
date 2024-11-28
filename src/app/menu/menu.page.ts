import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements AfterViewInit {
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService  ) {}

  async ngAfterViewInit() {
    this.loadUser();
  }

  private async loadUser() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.displayName || currentUser.email || 'Usuario';
    } else {
      this.username = 'Usuario';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onItemClick() {
    console.log('Item clicked');
  }
}
