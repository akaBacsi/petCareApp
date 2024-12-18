import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rutas públicas
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },

  // Rutas protegidas con AuthGuard
  { 
    path: 'pet-register', 
    loadChildren: () => import('./pet-register/pet-register.module').then(m => m.PetRegisterPageModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'edit-profile', 
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'menu', 
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pet-list', 
    loadChildren: () => import('./pet-list/pet-list.module').then(m => m.PetListPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'dog-list', 
    loadChildren: () => import('./dog-list/dog-list.module').then(m => m.DogListPageModule) 
  },
  {
    path: 'subscribe',
    loadChildren: () => import('./subscribe/subscribe.module').then(m => m.SubscribePageModule),
  },  

  // Ruta para manejar errores 404
  { 
    path: '**', 
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
