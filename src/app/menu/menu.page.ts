import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController, IonCard } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
    private authService: AuthService
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
