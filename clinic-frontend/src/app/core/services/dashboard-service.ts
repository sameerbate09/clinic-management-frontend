import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment.development';

export interface DashboardData {
  totalPatients: number;
  todaysVisits: number;
  todaysFollowUpCount: number;
  todaysFollowUps: any[];
  recentVisits: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
   private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

 getDashboardSummary(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/Dashboard/summary`);
}
}