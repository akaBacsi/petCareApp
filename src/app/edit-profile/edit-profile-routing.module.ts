import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetEditPage } from './edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PetEditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfilePageRoutingModule {}
