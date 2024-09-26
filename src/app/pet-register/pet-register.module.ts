import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetRegisterPageRoutingModule } from './pet-register-routing.module';

import { PetRegisterPage } from './pet-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetRegisterPageRoutingModule
  ],
  declarations: [PetRegisterPage]
})
export class PetRegisterPageModule {}
