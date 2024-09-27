import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import { BaseChartDirective } from 'ng2-charts';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AuthService} from "@core";
import {
  DashboardTimesheetsRiepilogoComponent
} from "./dashboard-timesheets-riepilogo/dashboard-timesheets-riepilogo.component";
import {PieImpiegatoChartComponent} from "./pie-impiegato-chart/pie-impiegato-chart.component";
import {FeriePermessiBarChartComponent} from "./ferie-permessi-bar-chart/ferie-permessi-bar-chart.component";
import {
  ChartResiduoGeneraleComponent
} from "../../admin/dashboard/chart-residuo-generale/chart-residuo-generale.component";
import {
  ChartResiduoAnniprecedentiComponent
} from "../../admin/dashboard/chart-residuo-anniprecedenti/chart-residuo-anniprecedenti.component";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {
  DashboardChipsComponentComponent
} from "@shared/components/dashboard-chips-component/dashboard-chips-component.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DashboardTimesheetsRiepilogoComponent,
    PieImpiegatoChartComponent,
    FeriePermessiBarChartComponent,
    DashboardChipsComponentComponent,
  ],
  templateUrl: './dashboard-imp.component.html',
  styleUrl: './dashboard-imp.component.scss'
})
export class DashboardImpComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  private mutationObserver!: MutationObserver;


  ngOnInit(): void {
    const bodyElement = this.document.body;

    // Initialize the MutationObserver
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          this.onBodyClassChange();
        }
      }
    });

    // Start observing the body element for attribute changes
    this.mutationObserver.observe(bodyElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

  }



  @ViewChild('barchart') chartResiduoAnniprecedentiComponent!: FeriePermessiBarChartComponent;

  onBodyClassChange() {
    // Your logic when the body class attribute changes
    if(this.router.url.includes('home')){
      setTimeout(()=>{
        this.chartResiduoAnniprecedentiComponent.chartComponent.updateOptions({});
      },800)
    }




  };


  constructor(@Inject(DOCUMENT) private document: Document,private router:Router) {
    super();
  }

}
