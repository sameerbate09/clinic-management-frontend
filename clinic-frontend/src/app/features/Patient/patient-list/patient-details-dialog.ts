import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientService } from '../../../core/services/patient-service';
import { PatientResponse } from '../../../shared/model/Patient/patient-response.model';


@Component({
  selector: 'app-patient-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './patient-details-dialog.html',
  styleUrl: './patient-details-dialog.scss',
})
export class PatientDetailsDialog {
  private patientService = inject(PatientService);
  private dialogRef = inject(MatDialogRef<PatientDetailsDialog>);
  private data = inject(MAT_DIALOG_DATA) as { id: string };

  patient$!: Observable<PatientResponse>;

  ngOnInit(): void {
    this.patient$ = this.patientService.getPatientById(this.data.id);
  }

  close() {
    this.dialogRef.close();
  }
}
