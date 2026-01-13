import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  AppointmentsService,
  CreateAppointmentRequest,
} from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let httpMock: HttpTestingController;

  const baseUrl = 'https://localhost:5001';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentsService],
    });

    service = TestBed.inject(AppointmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET appointments from /appts', () => {
    const mockResponse = [
      {
        id: 'a1',
        patientName: 'Jordan Lee',
        startsAt: '2026-01-13T12:00:00.000Z',
        notes: null,
      },
    ];

    let result: unknown;
    service.getAppointments().subscribe((data) => (result = data));

    const req = httpMock.expectOne(`${baseUrl}/appts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should POST create appointment to /appts with payload', () => {
    const payload: CreateAppointmentRequest = {
      patientName: 'Jordan Lee',
      startsAt: '2026-01-13T12:00:00.000Z',
      notes: 'Bring lab results',
    };

    const mockCreated = { id: 'created', ...payload };

    let result: unknown;
    service.createAppointment(payload).subscribe((data) => (result = data));

    const req = httpMock.expectOne(`${baseUrl}/appts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCreated);

    expect(result).toEqual(mockCreated);
  });
});
