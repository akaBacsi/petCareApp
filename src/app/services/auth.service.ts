import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  getUserDetails(uid: string): Observable<any> {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  async logout() {
    await this.afAuth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async register(email: string, password: string, username: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user?.uid;
    if (uid) {
      await this.firestore.collection('users').doc(uid).set({
        username,
        email,
        fingerprintRegistered: false
      });
    }
    return userCredential;
  }

  // Método para vincular la huella digital al usuario
  async linkFingerprintToUser(uid: string) {
    // Actualizar el campo en Firestore y retornar el estado
    return this.firestore.collection('users').doc(uid).update({
      fingerprintRegistered: true
    });
  }

  // Método para verificar si algún usuario tiene huella registrada
  async getRegisteredUserWithFingerprint() {
    const snapshot = await this.firestore
      .collection('users', ref => ref.where('fingerprintRegistered', '==', true))
      .get()
      .toPromise();

    // Verificar si snapshot es válido y tiene documentos
    if (snapshot && !snapshot.empty) {
      return snapshot.docs[0].data();
    } else {
      return null;
    }
  }
}
