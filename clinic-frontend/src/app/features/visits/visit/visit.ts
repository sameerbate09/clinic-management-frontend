import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, startWith, map, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Patient, PatientService } from '../../../core/services/patient-service';
import { CreateVisit, VisitRecord, VisitService } from '../../../core/services/visit-service';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './visit.html',
  styleUrl: './visit.scss'
})
export class Visit implements OnInit {
  visitForm!: FormGroup;
  patientControl = new FormControl<Patient | string>('', Validators.required);
  filteredPatients$ = new BehaviorSubject<Patient[]>([]);
  patients: Patient[] = [];
  visits$ = new BehaviorSubject<VisitRecord[]>([]);
  selectedPatient: Patient | null = null;
  displayedColumns = ['patient', 'complaint', 'visitDate', 'action'];

  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private visitService = inject(VisitService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadVisits();
  }

  initForm(): void {
    this.visitForm = this.fb.group({
      complaint: ['', Validators.required],
      notes: ['']
    });

    this.patientControl.valueChanges.pipe(
      startWith(''),
      tap(value => {
        if (typeof value === 'string') {
          this.selectedPatient = null;
        }
      }),
      map(value => (typeof value === 'string' ? value : value?.name ?? '')),
      map(value => this.filterPatients(value))
    ).subscribe(list => this.filteredPatients$.next(list));
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: patients => {
        this.patients = patients;
        this.filteredPatients$.next(patients);
      },
      error: err => {
        console.error('Error loading patients', err);
      }
    });
  }

  loadVisits(): void {
    this.visitService.getVisits().subscribe({
      next: visits => this.visits$.next(visits),
      error: err => {
        console.error('Error loading visits', err);
      }
    });
  }

  filterPatients(value: string): Patient[] {
    const filterValue = value.toLowerCase().trim();
    if (!filterValue) {
      return this.patients.slice();
    }

    return this.patients.filter(patient => {
      return (
        patient.name.toLowerCase().includes(filterValue) ||
        patient.mobile.toLowerCase().includes(filterValue)
      );
    });
  }

  displayPatient(patient: Patient | string): string {
    return typeof patient === 'string' ? patient : patient?.name ?? '';
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedPatient = event.option.value as Patient;
  }

  saveVisit(): void {
    if (this.visitForm.invalid || !this.selectedPatient) {
      return;
    }

    const request: CreateVisit = {
      patientId: this.selectedPatient.patientId ?? this.selectedPatient.id ?? '',
      complaint: this.visitForm.value.complaint,
      notes: this.visitForm.value.notes
    };

    this.visitService.addVisit(request).subscribe({
      next: () => {
        // this.loadVisits();
        this.clearForm();
        this.toastr.success('Visit saved successfully', 'Success');
      },
      error: err => {
        console.error('Error saving visit', err);
        this.toastr.error('Unable to save visit. Please try again.', 'Error');
      }
    });
  }

  clearForm(): void {
    this.visitForm.reset();
    this.patientControl.reset();
    this.selectedPatient = null;
  }

  deleteVisit(visit: VisitRecord): void {
    if (!visit.id) {
      return;
    }

    this.visitService.deleteVisit(visit.id).subscribe({
      next: () => this.loadVisits(),
      error: err => {
        console.error('Error deleting visit', err);
      }
    });
  }

  viewVisit(visit: VisitRecord): void {
    console.log('View visit', visit);
  }

  editVisit(visit: VisitRecord): void {
    console.log('Edit visit', visit);
  }
}
