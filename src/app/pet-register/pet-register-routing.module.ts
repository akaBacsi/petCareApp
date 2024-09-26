import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetRegisterPage } from './pet-register.page';

const routes: Routes = [
  {
    path: '',
    component: PetRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetRegisterPageRoutingModule {}
