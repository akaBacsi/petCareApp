import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogListPageRoutingModule } from './dog-list-routing.module';

import { DogListPage } from './dog-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogListPageRoutingModule
  ],
  declarations: [DogListPage]
})
export class DogListPageModule {}
