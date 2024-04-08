import {Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {GestioneTimesheetComponent} from "./gestione-timesheet/gestione-timesheet.component";
import {GestioneUtenteComponent} from "./gestione-utente/gestione-utente.component";
import {TimesheetDettaglioComponent} from "./gestione-timesheet/timesheet-dettaglio/timesheet-dettaglio.component";
import {TimesheetViewComponent} from "./timesheet-view/timesheet-view.component";

export const AdminRoutes : Routes = [
  {path:'', component:DashboardComponent},
  {path:'home', component:DashboardComponent},
  {path:'gestionetimesheet', component:GestioneTimesheetComponent},
  {path:'timesheet/:id', component:TimesheetViewComponent},
  {path:'gestioneImpiegato', component:GestioneUtenteComponent},
  {path:'**', redirectTo:'/page404',pathMatch:"full"}
]
