import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { PatientService, Patient } from '../../../core/services/patient-service';

@Component({
  selector: 'app-patient-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
})

export class PatientList {
 
  private router = inject(Router);
  private patientService = inject(PatientService);

  patientsList$!: Observable<Patient[]>;

    ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (token) {
      this.patientsList$ = this.patientService.getPatients();
    } else {
      this.router.navigate(['/login']);
    }
    }  
}