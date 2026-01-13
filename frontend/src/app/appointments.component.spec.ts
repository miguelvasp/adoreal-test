import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AppointmentsComponent } from './appointments.component';
import {
  Appointment,
  AppointmentsService,
  CreateAppointmentRequest,
} from './appointments.service';

describe('AppointmentsComponent', () => {
  let fixture: ComponentFixture<AppointmentsComponent>;
  let component: AppointmentsComponent;
  let serviceSpy: jasmine.SpyObj<AppointmentsService>;

  const mockAppointments: Appointment[] = [
    {
      id: 'a1',
      patientName: 'Jordan Lee',
      startsAt: '2026-01-13T12:00:00.000Z',
      notes: null,
    },
  ];

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj<AppointmentsService>(
      'AppointmentsService',
      ['getAppointments', 'createAppointment']
    );

    // O constructor chama loadAppointments() automaticamente.
    serviceSpy.getAppointments.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AppointmentsComponent],
      providers: [{ provide: AppointmentsService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getAppointments on construction (initial load)', () => {
    expect(serviceSpy.getAppointments).toHaveBeenCalled();
  });

  it('loadAppointments should populate appointments$ when service succeeds', (done) => {
    serviceSpy.getAppointments.and.returnValue(of(mockAppointments));

    component.appointments$.subscribe((appointments) => {
      if (appointments.length === 1) {
        expect(appointments).toEqual(mockAppointments);
        done();
      }
    });

    component.loadAppointments();
  });

  it('loadAppointments should expose an error message when service fails', (done) => {
    serviceSpy.getAppointments.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.error$.subscribe((message) => {
      if (message) {
        expect(message).toBe('Unable to load appointments. Try again.');
        done();
      }
    });

    component.loadAppointments();
  });

  it('submit should not call createAppointment when form is invalid and should mark fields as touched', () => {
    component.form.setValue({ patientName: '', startsAt: '', notes: '' });

    component.submit();

    expect(serviceSpy.createAppointment).not.toHaveBeenCalled();
    expect(component.form.controls.patientName.touched).toBeTrue();
    expect(component.form.controls.startsAt.touched).toBeTrue();
  });

  it('submit should call createAppointment with trimmed payload and then refresh appointments on success', () => {
    serviceSpy.getAppointments.and.returnValue(of(mockAppointments));
    serviceSpy.createAppointment.and.returnValue(
      of({
        id: 'created',
        patientName: 'Jordan Lee',
        startsAt: '2026-01-13T12:00:00.000Z',
        notes: null,
      })
    );

    const loadSpy = spyOn(component, 'loadAppointments').and.callThrough();

    component.form.setValue({
      patientName: 'Jordan Lee',
      startsAt: '2026-01-13T09:00',
      notes: '  ',
    });

    component.submit();

    expect(serviceSpy.createAppointment).toHaveBeenCalledTimes(1);

    const actualPayload: CreateAppointmentRequest =
      serviceSpy.createAppointment.calls.mostRecent().args[0];
    expect(actualPayload.patientName).toBe('Jordan Lee');
    expect(actualPayload.notes).toBeNull();
    expect(actualPayload.startsAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:/); // ISO-ish

    expect(loadSpy).toHaveBeenCalled();
  });

  it('template should show field error when patientName is touched and invalid', () => {
    component.form.controls.patientName.markAsTouched();
    component.form.controls.patientName.setValue('');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.field-error'));
    expect(errorEl).toBeTruthy();
  });
});
