import {Component, OnInit, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {PieChartComponent} from "@swimlane/ngx-charts";
import Swal from "sweetalert2";
import {StatChartService} from "@core/service/stat-chart.service";

@Component({
  selector: 'app-pie-impiegato-chart',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgChartsModule,
  ],
  templateUrl: './pie-impiegato-chart.component.html',
  styleUrl: './pie-impiegato-chart.component.scss'
})
export class PieImpiegatoChartComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  @ViewChild('piechart') chartStatTimesheet!: BaseChartDirective;

  constructor(private statChartService:StatChartService) {
    super();
  }


  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Inviati'], ['Approvati'], 'Rifiutati'],
    datasets: [{"data":[0,1,0],"backgroundColor":["#ff8800","#0bff00","#ff0000"]}],
  };
  public pieChartType: ChartType = 'pie';
  loading: boolean=false;

  ngOnInit(): void {

    this.subs.sink=this.statChartService.fetchImpiegatoPieChart().subscribe({
      next: (res) => {
        this.pieChartData= {
          labels: [['Inviati'], ['Approvati'], 'Rifiutati'],
          datasets: res,
        }
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
