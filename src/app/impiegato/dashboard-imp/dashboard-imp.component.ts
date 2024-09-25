import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AuthService} from "@core";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard-imp.component.html',
  styleUrl: './dashboard-imp.component.scss'
})
export class DashboardImpComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  ngOnInit(): void {
  }



  constructor() {
    super();
  }

}
