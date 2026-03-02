import { Component, inject, OnInit } from '@angular/core';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AfterViewInit } from '@angular/core';
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
  export class Dashboard implements OnInit, AfterViewInit {

  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  dashboardData$!: Observable<DashboardData>;
  isMobile = false;

  ngOnInit(): void {
    const token = localStorage.getItem('token');

     this.breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe(result => {

      this.isMobile = result.matches;

      if (this.isMobile) {
        this.sidenav.close();
      } else {
        this.sidenav.open();
      }
    });

    if (token) {
      this.dashboardData$ = this.dashboardService.getDashboardSummary();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit(): void {

    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe(result => {

        this.isMobile = result.matches;

        if (this.sidenav) {
          if (this.isMobile) {
            this.sidenav.close();
          } else {
            this.sidenav.open();
          }
        }
      });
  }
}