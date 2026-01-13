import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppointmentsComponent } from './appointments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppointmentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
