import {Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {GestioneTimesheetComponent} from "./gestione-timesheet/gestione-timesheet.component";

export const ImpiegatoRoutes : Routes = [
  {path:'', component:DashboardComponent},
  {path:'home', component:DashboardComponent},
  {path:'timesheet', component:GestioneTimesheetComponent},
  {path:'**', redirectTo:'/page404',pathMatch:"full"}
]
