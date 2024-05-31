import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { Appointment } from '../../interfaces/appointment.interface';
import { TimeSlot } from '../../interfaces/time-slot.interface';
import { randomizedNumId } from '../../core/helpers/randomize';
import { AppointmentsService } from '../../core/services/appointments.service';
import { generateTimeSlots } from '../../core/helpers/time-slots';

@Component({
  standalone: true,
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
  imports: [
    MatButton, MatTooltip,
    MatIconModule, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule],

})
export class AddAppointmentComponent implements OnInit {
  service = inject(AppointmentsService);
  dialog= inject(MatDialog);
  constructor(@Inject(MAT_DIALOG_DATA) public timeSlot: TimeSlot) {}


  startTimeSlots: TimeSlot[] = [];

  ngOnInit(): void {
    this.startTimeSlots = generateTimeSlots(this.timeSlot.day);

  }

  get availableEndTimeSlots(): TimeSlot[] {
    const startTimeValue: TimeSlot | null = this.appointmentForm.get('startTime')?.value ?? this.startTimeSlots[0];
    if (!startTimeValue) return [];

    return this.startTimeSlots.filter(slot =>
      slot.value > startTimeValue.value
    );
  }

  appointmentForm = new FormGroup({
    id: new FormControl<number>(randomizedNumId()),
    title: new FormControl<string | undefined>(''),
    startTime: new FormControl<TimeSlot | null>(this.startTimeSlots[0]),
    endTime: new FormControl<TimeSlot | null>(null),
    description: new FormControl<string | undefined>(''),
  });

  formatTimeSlot(dateTime: Date): string {
    return dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  saveAppointment(): void {
    const value = this.appointmentForm.value;
    if (!value.endTime || !value.startTime) return;

    const appointmentData: any = {
      ...value,
      startTime: value.startTime?.value,
      endTime: value.endTime?.value
    };

    this.service.saveAppointment(appointmentData);
    this.dialog.closeAll();

    console.log('Appointment saved:', appointmentData);
  }
}
