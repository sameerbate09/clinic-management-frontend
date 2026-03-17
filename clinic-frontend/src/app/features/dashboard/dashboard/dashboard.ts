import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/* Services */
import { DashboardService, DashboardData } from '../../../core/services/dashboard-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  dashboardData$!: Observable<DashboardData>;

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (token) {
      this.dashboardData$ = this.dashboardService.getDashboardSummary();
    } else {
      this.router.navigate(['/login']);
    }

  }

}
