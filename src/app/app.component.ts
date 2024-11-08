import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLiteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private sqliteService: SQLiteService
  ) {}

  async ngOnInit() {
    await this.sqliteService.initializeDatabase();
    const storedSession = await this.sqliteService.getStoredSession();
    if (storedSession) {
      this.router.navigate(['/menu']);
    }
  }
}
