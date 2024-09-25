import {Routes} from "@angular/router";
import {RiepilogoTimesheetComponent} from "./riepilogo-timesheet/riepilogo-timesheet.component";
import {RicercaTimesheetComponent} from "./ricerca-timesheet/ricerca-timesheet.component";
import {
  TimesheetDettaglioComponent
} from "./timesheet-dettaglio/timesheet-dettaglio.component";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {DashboardImpComponent} from "./dashboard-imp/dashboard-imp.component";


export const ImpiegatoRoutes : Routes = [
  {path:'', component:DashboardImpComponent},
  {path:'home', component:DashboardImpComponent},
  {path:'timesheet', component:RicercaTimesheetComponent},
  {path:'riepilogoTimesheet', component:RiepilogoTimesheetComponent},
  { path: 'account', component:UserProfileComponent},
  {path:'**', redirectTo:'/page404',pathMatch:"full"}
]
