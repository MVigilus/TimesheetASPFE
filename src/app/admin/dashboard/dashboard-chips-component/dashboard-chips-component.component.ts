import {Component, OnInit} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AdminService} from "@core/service/admin.service";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {AuthService} from "@core";
import {ChipsDTO} from "@shared/components/ChipsDTO";
import {Observable, Subject} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dashboard-chips-component',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './dashboard-chips-component.component.html',
  styleUrl: './dashboard-chips-component.component.scss'
})
export class DashboardChipsComponentComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  chips!:ChipsDTO[];

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit(): void {

    this.subs.sink=this.authService.fetchChipsForDashboard().subscribe({
      next: data => {
        this.chips=[...data]
      },
      error: error => {},
      complete: () => {}
    });

  }



}
