import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular'; // Importar Ionic Storage para persistencia local

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: Storage
  ) {
    this.initStorage(); // Inicializar almacenamiento local
  }

  async initStorage() {
    this._storage = await this.storage.create();
  }

  // Obtener el usuario actual desde Firebase
  getCurrentUser(): Promise<FirebaseUser | null> {
    return this.afAuth.currentUser as Promise<FirebaseUser | null>;
  }

  // Obtener detalles del usuario por UID desde Firestore
  getUserDetails(uid: string): Observable<any> {
    const userDoc = this.firestore.collection('users').doc(uid);
    return userDoc.valueChanges();
  }

  // Registrar nuevo usuario
  async register(email: string, password: string, username: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    
    // Validar si el email y UID existen antes de guardar la sesión
    if (userCredential.user?.email && userCredential.user?.uid) {
      await this.saveSession(userCredential.user.email, userCredential.user.uid);
    }

    await this.firestore.collection('users').doc(userCredential.user?.uid).set({ username });
    return userCredential;
  }

  // Restablecer contraseña
  async resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Iniciar sesión y guardar en SQLite
  async login(email: string, password: string) {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    
    // Validar si el email y UID existen antes de guardar la sesión
    if (userCredential.user?.email && userCredential.user?.uid) {
      await this.saveSession(userCredential.user.email, userCredential.user.uid);
    }

    return userCredential;
  }

  // Guardar la sesión del usuario en SQLite
  private async saveSession(email: string, uid: string) {
    await this._storage?.set('session', { email, uid });
  }

  // Obtener la sesión guardada de SQLite
  async getSession() {
    return await this._storage?.get('session');
  }

  // Verificar si el usuario está autenticado a través de Firebase o SQLite
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user || !!this._storage?.get('session'))
    );
  }

  // Cerrar sesión y eliminar la sesión almacenada en SQLite
  async logout() {
    await this.afAuth.signOut();
    await this._storage?.remove('session'); // Eliminar la sesión guardada
  }

  // Verificar si hay una sesión almacenada en SQLite
  async isLoggedIn(): Promise<boolean> {
    const session = await this.getSession();
    return !!session; // Retorna true si hay sesión guardada
  }
}
