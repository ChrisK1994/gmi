import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/board',
    pathMatch: 'full'
  },
  {
    path: 'board',
    loadChildren: () => import('../app/main/board/board.module').then((m) => m.BoardModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/main/auth/auth.module').then((m) => m.AuthModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
