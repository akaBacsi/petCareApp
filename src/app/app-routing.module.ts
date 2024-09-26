import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'pet-register', loadChildren: () => import('./pet-register/pet-register.module').then(m => m.PetRegisterPageModule) },
  { path: 'edit-profile', loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule) },
  { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule) },
  { path: 'pet-list', loadChildren: () => import('./pet-list/pet-list.module').then( m => m.PetListPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
