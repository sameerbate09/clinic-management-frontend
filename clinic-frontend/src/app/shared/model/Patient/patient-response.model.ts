export interface PatientAddress {
  street?: string;
  city?: string;
  pincode?: string;
}

export interface PatientResponse {
  patientId: string;
  name: string;
  mobile: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  address?: PatientAddress;
}