import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CreatePatient } from '../../../shared/model/Patient/create-patient.model';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.scss',
})
export class AddPatient {

  patientForm!: FormGroup;
  private toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: [null, Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      bloodGroup: [''],
      concern: [''],

      address: this.fb.group({
        street: [''],
        city: [''],
        pincode: ['']
      })
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    const formValue = this.patientForm.value;

    formValue.gender = formValue.gender === 'male' ? 'Male' : 'Female';

    const request: CreatePatient = formValue;

    console.log('Payload:', request);

    this.patientService.addPatient(request).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.toastr.success('Patient added successfully');
        this.router.navigate(['/patients-list']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastr.error('Failed to add patient');
      }
    });
  }

  goBack() {
    this.router.navigate(['/patients-list']);
  }
}