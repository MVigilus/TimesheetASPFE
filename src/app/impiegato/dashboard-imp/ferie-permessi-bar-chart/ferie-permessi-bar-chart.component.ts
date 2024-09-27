import {Component, OnInit, ViewChild} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ChartComponent, NgApexchartsModule} from "ng-apexcharts";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ChartOptions} from "@shared/components/ChartOptions";
import {AdminService} from "@core/service/admin.service";
import Swal from "sweetalert2";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {StatChartService} from "@core/service/stat-chart.service";

@Component({
  selector: 'app-ferie-permessi-bar-chart',
  standalone: true,
    imports: [
        MatProgressSpinner,
        NgApexchartsModule
    ],
  templateUrl: './ferie-permessi-bar-chart.component.html',
  styleUrl: './ferie-permessi-bar-chart.component.scss'
})
export class FeriePermessiBarChartComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @ViewChild('chart') chartComponent!: ChartComponent;
  @ViewChild('containerRef') containerRef!: HTMLDivElement;

  public barChartOptions!: Partial<ChartOptions>;
  public loading:boolean=true;

  constructor(private impiegatoService: StatChartService,) {
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
          'Ore Ferie Anno Corrente',
          'Ore Ferie Anno Prec.',
          'Ore Permesso Anno Corrente',
          'Ore Permesso Anno Prec.',
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
    this.loading = false;

    /*this.barChartOptions.series=[{
      name: 'Totale Ore',
      data: [44,44],
    },]*/


    this.subs.sink=this.impiegatoService.fetchImpiegatoOrePFStat().subscribe({
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
