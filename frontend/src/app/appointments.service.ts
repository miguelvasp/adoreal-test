import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Appointment {
  id: string;
  patientName: string;
  startsAt: string;
  notes?: string | null;
}

export interface CreateAppointmentRequest {
  patientName: string;
  startsAt: string;
  notes?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly baseUrl = 'https://localhost:44374';

  constructor(private readonly http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appts`);
  }

  createAppointment(
    request: CreateAppointmentRequest
  ): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appts`, request);
  }
}
