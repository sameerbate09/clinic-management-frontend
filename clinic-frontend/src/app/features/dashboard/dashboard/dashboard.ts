import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../core/services/dashboard-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardData } from '../../../core/services/dashboard-service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

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