import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  patientId?: string;
  isEditMode = false;
  pageTitle = 'Add Patient';
  actionLabel = 'Add Patient';
  private toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        return;
      }

      this.patientId = id;
      this.isEditMode = true;
      this.pageTitle = 'Edit Patient';
      this.actionLabel = 'Update Patient';

      this.patientService.getPatientById(id).subscribe({
        next: (patient) => {
          this.patientForm.patchValue({
            name: patient.name,
            gender: patient.gender?.toLowerCase(),
            age: patient.age,
            mobile: patient.mobile,
            bloodGroup: patient.bloodGroup ?? '',
            concern: (patient as any).concern ?? '',
            address: {
              street: patient.address?.street ?? '',
              city: patient.address?.city ?? '',
              pincode: patient.address?.pincode ?? ''
            }
          });
        },
        error: (err) => {
          console.error('Error loading patient', err);
          this.toastr.error('Failed to load patient details');
        }
      });
    });
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

    const address = formValue.address;
    const hasAddress = address && (address.street?.trim() || address.city?.trim() || address.pincode?.trim());

    const request: CreatePatient = {
      ...formValue,
      address: hasAddress
        ? {
            street: address.street?.trim() ?? '',
            city: address.city?.trim() ?? '',
            pincode: address.pincode?.trim() ?? ''
          }
        : null
    } as CreatePatient;
    console.log('Payload:', request);

    if (this.patientId) {
      this.patientService.updatePatient(this.patientId, request).subscribe({
        next: (res) => {
          console.log('Update Success:', res);
          this.toastr.success('Patient updated successfully');
          this.router.navigate(['/patients-list']);
        },
        error: (err) => {
          console.error('Update Error:', err);
          this.toastr.error('Failed to update patient');
        }
      });
      return;
    }

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