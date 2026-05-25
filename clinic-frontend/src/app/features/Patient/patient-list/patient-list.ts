import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { PatientService, Patient } from '../../../core/services/patient-service';
import { PatientDetailsDialog } from './patient-details-dialog';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
})

export class PatientList {
 
  private router = inject(Router);
  private patientService = inject(PatientService);
  private dialog = inject(MatDialog);

  patientsList$!: Observable<Patient[]>;

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.patientsList$ = this.patientService.getPatients();
    } else {
      this.router.navigate(['/login']);
    }
  }

  openPatientDetails(patientId: string | undefined) {
    if (!patientId) {
      console.warn('Patient ID missing. Cannot open details dialog.');
      return;
    }

    this.dialog.open(PatientDetailsDialog, {
      width: '560px',
      data: { id: patientId }
    });
  }
}