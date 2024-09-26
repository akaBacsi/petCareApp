import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // obtener el usuario actual
  getCurrentUser(): Promise<FirebaseUser | null> {
    return this.afAuth.currentUser as Promise<FirebaseUser | null>;
  }

  // detalles del usuario por UID
  getUserDetails(uid: string): Observable<any> {
    const userDoc = this.firestore.collection('users').doc(uid);
    return userDoc.valueChanges();
  }

  // registrar nuevo usuario
  async register(email: string, password: string, username: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await this.firestore.collection('users').doc(userCredential.user?.uid).set({ username });
    return userCredential;
  }

  // iniciar sesión
  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // cerrar sesión
  async logout() {
    return await this.afAuth.signOut();
  }

  // restablecer contraseña
  async resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}
