import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private db!: SQLiteDBConnection;

  constructor() {}

  async initializeDatabase() {
    try {
      const dbConnection = await CapacitorSQLite.createConnection({
        database: 'petcare_db',
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
        readonly: false,
      }) as SQLiteDBConnection | undefined;

      if (dbConnection) {
        this.db = dbConnection;
        await this.db.open();
        await this.createTables(); // Llamar a createTables para evitar el error de valor no usado
        console.log('Base de datos inicializada');
      } else {
        console.error('Error en la conexión con la base de datos');
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
    }
  }

  private async createTables() {
    const query = `
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS fingerprint (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        isRegistered INTEGER NOT NULL
      );
    `;
    await this.db.execute(query);
    console.log('Tablas creadas correctamente');
  }

  async storeSession(userId: string) {
    const query = `
      INSERT INTO session (userId) VALUES (?);
    `;
    await this.db.run(query, [userId]);
    console.log('Sesión almacenada');
  }

  async getStoredSession(): Promise<string | null> {
    const query = `SELECT * FROM session LIMIT 1;`;
    const result = await this.db.query(query);
    return result.values && result.values.length > 0 ? result.values[0].userId : null;
  }

  async registerFingerprint(userId: string) {
    const query = `
      INSERT INTO fingerprint (userId, isRegistered)
      VALUES (?, 1)
      ON CONFLICT(userId) DO UPDATE SET isRegistered = 1;
    `;
    await this.db.run(query, [userId]);
    console.log('Huella digital registrada');
  }

  async isFingerprintRegistered(userId: string): Promise<boolean> {
    const query = `SELECT * FROM fingerprint WHERE userId = ? AND isRegistered = 1;`;
    const result = await this.db.query(query, [userId]);
    return result.values ? result.values.length > 0 : false;
  }

  async closeConnection() {
    await CapacitorSQLite.closeConnection({ database: 'petcare_db' });
  }
}
