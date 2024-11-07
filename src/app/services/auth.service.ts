import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbService } from './dbservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private dbService: DbService
  ) {}

  // Método para obtener el usuario actual de Firebase
  getCurrentUser(): Promise<any> {
    return this.afAuth.currentUser;
  }

  // Método para obtener detalles del usuario por UID
  getUserDetails(_uid: string): Observable<any> {
    return from(this.getCurrentUser()).pipe(map(user => (user ? { uid: user.uid, email: user.email } : null)));
  }

  // Registrar nuevo usuario
  async register(email: string, password: string, _username: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    return userCredential;
  }

  // Restablecer contraseña
  async resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Iniciar sesión
  async login(email: string, password: string) {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    return userCredential;
  }

  // Verificar si el usuario está autenticado (basado en la sesión en SQLite)
  isAuthenticated(): Observable<boolean> {
    return from(this.dbService.getSession().then(session => !!session));
  }

  // Cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    await this.dbService.deleteSession();
  }
}
