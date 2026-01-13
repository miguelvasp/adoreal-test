import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  Appointment,
  AppointmentsService,
  CreateAppointmentRequest,
} from './appointments.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly formBuilder = inject(FormBuilder);

  readonly appointments$ = this.appointmentsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  readonly form = this.formBuilder.group({
    patientName: ['', [Validators.required, Validators.maxLength(120)]],
    startsAt: ['', Validators.required],
    notes: [''],
  });

  constructor(private readonly service: AppointmentsService) {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service
      .getAppointments()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (appointments) => this.appointmentsSubject.next(appointments),
        error: () =>
          this.errorSubject.next('Unable to load appointments. Try again.'),
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const startsAtIso = this.toIsoString(this.form.value.startsAt ?? '');
    if (!startsAtIso) {
      this.errorSubject.next('Enter a valid date and time.');
      return;
    }

    const payload: CreateAppointmentRequest = {
      patientName: this.form.value.patientName?.trim() ?? '',
      startsAt: startsAtIso,
      notes: this.form.value.notes?.trim() || null,
    };

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service
      .createAppointment(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: () => {
          this.form.reset({ patientName: '', startsAt: '', notes: '' });
          this.loadAppointments();
        },
        error: () =>
          this.errorSubject.next('Unable to create appointment. Try again.'),
      });
  }

  trackById(_index: number, appointment: Appointment): string {
    return appointment.id;
  }

  private toIsoString(value: string): string | null {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toISOString();
  }
}
