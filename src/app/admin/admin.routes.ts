import {Routes} from "@angular/router";
import {GestioneTimesheetComponent} from "./gestione-timesheet/gestione-timesheet.component";
import {GestioneUtenteComponent} from "./gestione-utente/gestione-utente.component";
import {TimesheetViewComponent} from "./timesheet-view/timesheet-view.component";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const AdminRoutes : Routes = [
  {path:'', component:DashboardComponent},
  {path:'home', component:DashboardComponent},
  {path:'gestionetimesheet', component:GestioneTimesheetComponent},
  {path:'timesheet/:id', component:TimesheetViewComponent},
  {path:'gestioneImpiegato', component:GestioneUtenteComponent},
  { path: 'account', component:UserProfileComponent},
  {path:'**', redirectTo:'/page404',pathMatch:"full"},
]
