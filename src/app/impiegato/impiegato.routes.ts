import {Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {RiepilogoTimesheetComponent} from "./riepilogo-timesheet/riepilogo-timesheet.component";
import {RicercaTimesheetComponent} from "./ricerca-timesheet/ricerca-timesheet.component";
import {
  TimesheetDettaglioComponent
} from "./timesheet-dettaglio/timesheet-dettaglio.component";


export const ImpiegatoRoutes : Routes = [
  {path:'', component:DashboardComponent},
  {path:'home', component:DashboardComponent},
  {path:'timesheet', component:RicercaTimesheetComponent},
  {path:'riepilogoTimesheet', component:RiepilogoTimesheetComponent},
  {path:'**', redirectTo:'/page404',pathMatch:"full"}
]
