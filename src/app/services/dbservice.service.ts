import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private storage: SQLiteObject | null = null;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.createDatabase();
  }

  // Inicializa la base de datos al cargar la plataforma
  async createDatabase() {
    await this.platform.ready();
    this.sqlite
      .create({
        name: 'petCareApp.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.storage = db;
        this.createTable();
      })
      .catch((e) => console.log('Error al crear la BD:', e));
  }

  // Crea la tabla de sesión si no existe
  createTable() {
    if (!this.storage) {
      console.error('La base de datos no está lista');
      return;
    }

    this.storage
      .executeSql(
        `CREATE TABLE IF NOT EXISTS session(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT, 
        uid TEXT
      )`,
        []
      )
      .then(() => {
        this.isDbReady.next(true);
        console.log('Tabla de sesión creada');
      })
      .catch((e) => console.log('Error al crear la tabla:', e));
  }

  // Agrega una nueva sesión a la base de datos
  addSession(email: string, uid: string) {
    const data = [email, uid];
    if (!this.storage) {
      console.error('La base de datos no está lista');
      return Promise.reject('Database is not ready');
    }

    return this.storage
      .executeSql('INSERT INTO session (email, uid) VALUES (?, ?)', data)
      .then(() => {
        console.log('Sesión guardada en la BD');
      })
      .catch((e) => console.log('Error al guardar la sesión:', e));
  }

  // Obtiene la sesión almacenada
  getSession() {
    if (!this.storage) {
      console.error('La base de datos no está lista');
      return Promise.reject('Database is not ready');
    }

    return this.storage
      .executeSql('SELECT * FROM session LIMIT 1', [])
      .then((res) => {
        if (res.rows.length > 0) {
          return {
            email: res.rows.item(0).email,
            uid: res.rows.item(0).uid,
          };
        }
        return null;
      })
      .catch((e) => {
        console.log('Error al obtener la sesión:', e);
        return null;
      });
  }

  // Elimina la sesión almacenada
  deleteSession() {
    if (!this.storage) {
      console.error('La base de datos no está lista');
      return Promise.reject('Database is not ready');
    }

    return this.storage
      .executeSql('DELETE FROM session', [])
      .then(() => {
        console.log('Sesión eliminada');
      })
      .catch((e) => console.log('Error al eliminar la sesión:', e));
  }

  // Devuelve el estado de la base de datos (si está lista o no)
  dbState() {
    return this.isDbReady.asObservable();
  }
}
