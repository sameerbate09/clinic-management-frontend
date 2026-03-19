import { Address } from './address.model';

export interface CreatePatient{
  name: string;
  mobile: string;
  age: number;
  gender: 'Male' | 'Female';
  concern?: string;
  bloodGroup?: string;
  address?: Address;
}
