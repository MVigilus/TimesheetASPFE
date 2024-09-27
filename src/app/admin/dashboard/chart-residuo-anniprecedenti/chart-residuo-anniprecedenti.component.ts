import {Component, OnInit, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ChartOptions} from "@shared/components/ChartOptions";
import {AdminService} from "@core/service/admin.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ChartComponent, NgApexchartsModule} from "ng-apexcharts";
import Swal from "sweetalert2";
import {StatChartService} from "@core/service/stat-chart.service";

@Component({
  selector: 'app-chart-residuo-anniprecedenti',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgApexchartsModule
  ],
  templateUrl: './chart-residuo-anniprecedenti.component.html',
  styleUrl: './chart-residuo-anniprecedenti.component.scss'
})
export class ChartResiduoAnniprecedentiComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @ViewChild('chart') chartComponent!: ChartComponent;
  @ViewChild('containerRef') containerRef!: HTMLDivElement;

  public barChartOptions!: Partial<ChartOptions>;
  public loading:boolean=true;

  constructor(private adminService: StatChartService,) {
    super();


  }

  ngOnInit(): void {

    this.barChartOptions = {
      series: [
        /*{
          name: 'Net Profit',
          data: [44, 55],
        },*/
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Ore Permesso',
          'Ore Ferie',
        ],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };

    this.subs.sink=this.adminService.fetchAdminResiduoPrecChart().subscribe({
      next: (res) => {
        this.barChartOptions.series=[...res]
      },
      error: (err) => {
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
      },
      complete: () => {
        this.loading = false;
      },
    })

  }



}
