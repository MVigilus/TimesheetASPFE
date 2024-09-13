import { Routes } from '@angular/router';
import {AuthLayoutComponent} from "./layout/app-layout/auth-layout/auth-layout.component";
import {MainLayoutComponent} from "./layout/app-layout/main-layout/main-layout.component";
import {AuthGuard} from "@core/guard/auth.guard";
import {LockedComponent} from "./authentication/locked/locked.component";
import {Page404Component} from "@config/wildcard/page404/page404.component";
import {Page500Component} from "@config/wildcard/page500/page500.component";
import {AdminGuard} from "@core/guard/admin.guard";
import {ImpiegatoGuard} from "@core/guard/impiegato.guard";

export const routes: Routes = [
  {
    path:'',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      { path: 'admin', loadChildren: ()=> import('./admin/admin.routes').then((m)=> m.AdminRoutes),  canActivate:[AdminGuard]},
      { path: 'impiegato', loadChildren: ()=> import('./impiegato/impiegato.routes').then((m)=> m.ImpiegatoRoutes), canActivate:[ImpiegatoGuard] }
    ]
  },
  {
    path: "locked",
    component: LockedComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  }
];
