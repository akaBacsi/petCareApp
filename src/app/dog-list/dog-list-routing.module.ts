import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogListPage } from './dog-list.page';

const routes: Routes = [
  {
    path: '',
    component: DogListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogListPageRoutingModule {}
