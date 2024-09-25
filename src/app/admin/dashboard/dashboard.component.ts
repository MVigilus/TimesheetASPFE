import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  HostListener, Inject, OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {ChartResiduoGeneraleComponent} from "./chart-residuo-generale/chart-residuo-generale.component";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AuthService} from "@core";
import {
  ChartResiduoAnniprecedentiComponent
} from "./chart-residuo-anniprecedenti/chart-residuo-anniprecedenti.component";
import {ChartResiduoAnnoincorsoComponent} from "./chart-residuo-annoincorso/chart-residuo-annoincorso.component";
import {DashboardChipsComponentComponent} from "./dashboard-chips-component/dashboard-chips-component.component";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    ChartResiduoGeneraleComponent,
    ChartResiduoAnniprecedentiComponent,
    ChartResiduoAnnoincorsoComponent,
    DashboardChipsComponentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends UnsubscribeOnDestroyAdapter implements OnInit,AfterViewChecked {

  @ViewChild('chartResiduoGeneraleComponent') chartResiduoGeneraleComponent!: ChartResiduoGeneraleComponent;
  @ViewChild('chartResiduoAnniprecedentiComponent') chartResiduoAnniprecedentiComponent!: ChartResiduoAnniprecedentiComponent;
  @ViewChild('chartResiduoAnnoincorsoComponent') chartResiduoAnnoincorsoComponent!: ChartResiduoAnnoincorsoComponent;

  private mutationObserver!: MutationObserver;
  private firstload=true;

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
  }

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

  onBodyClassChange() {
    // Your logic when the body class attribute changes
    setTimeout(()=>{
      this.firstload = false;
      this.chartResiduoGeneraleComponent.chartComponent.updateOptions({});
      this.chartResiduoAnniprecedentiComponent.chartComponent.updateOptions({});
      this.chartResiduoAnnoincorsoComponent.chartComponent.updateOptions({});
    },800)



  };

  ngAfterViewChecked(): void {


  }


}
