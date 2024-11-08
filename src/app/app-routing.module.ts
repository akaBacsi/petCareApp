import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  // Ruta predeterminada que redirige a la página de login
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

  // Ruta a Product Detail sin guard, ya que los datos de la API de Petfood no requieren autenticación
  { 
    path: 'product-detail',
    loadChildren: () => import('./product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
    canActivate: [AuthGuard] // Opcional, solo si deseas proteger la ruta
  },

  // Ruta para manejo de rutas no encontradas
  { 
    path: '**', 
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
