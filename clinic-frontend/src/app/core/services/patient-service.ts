import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreatePatient } from '../../shared/model/Patient/create-patient.model';
import { PatientResponse } from '../../shared/model/Patient/patient-response.model';

export interface Patient {
  patientId?: string;
  id?: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  mobile: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patient`);
  }

  getPatientById(id: string): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/Patient/${id}`);
  }

  addPatient(request: CreatePatient): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(`${this.baseUrl}/patient`, request);
  }

  updatePatient(id: string, request: CreatePatient): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.baseUrl}/Patient/${id}`, request);
  }
}
