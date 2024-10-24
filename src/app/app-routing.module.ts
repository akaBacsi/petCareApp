import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MenuPage } from './menu/menu.page'; // Asegúrate de que esta importación sea correcta

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'menu',
    component: MenuPage, // Cambia aquí a component
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: 'pet-register',
        loadChildren: () => import('./pet-register/pet-register.module').then(m => m.PetRegisterPageModule)
      },
      {
        path: 'pet-list',
        loadChildren: () => import('./pet-list/pet-list.module').then(m => m.PetListPageModule)
      }
    ]
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule) // 404 Page
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}