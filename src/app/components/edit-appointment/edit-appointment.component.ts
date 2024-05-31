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
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.scss',
  imports: [
    MatButton, MatTooltip,
    MatIconModule, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule],

})
export class EditAppointmentComponent implements OnInit {
  service = inject(AppointmentsService);
  dialog = inject(MatDialog);

  startTimeSlots: TimeSlot[] = [];
  appointmentForm = new FormGroup({
    id: new FormControl<number>(randomizedNumId()),
    title: new FormControl<string | undefined>(''),
    startTime: new FormControl<string | null>(null),
    endTime: new FormControl<string | null>(null),
    description: new FormControl<string | undefined>(''),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public appointment: Appointment) { }



  ngOnInit(): void {

    if (!this.appointment || !this.appointment.id) {
      // this.dialog.closeAll();
    }
    console.log(this.appointment)
    this.startTimeSlots = generateTimeSlots(this.appointment.startTime);

    this.patchValue();
  }

  patchValue() {
    if (!this.appointment || !this.appointment.id) {
      return;
    }
    this.appointmentForm.patchValue({
      id: this.appointment.id!,
      title: this.appointment.title ?? '',
      description: this.appointment.description ?? '',
      startTime: this.appointment.startTime.toISOString(),
      endTime: this.appointment.endTime.toISOString(),

    });
  }

  get availableEndTimeSlots(): TimeSlot[] {
    const startTimeValue: string | null = this.appointmentForm.get('startTime')?.value ?? this.startTimeSlots[0].value.toISOString();
    if (!startTimeValue) return [];

    return this.startTimeSlots.filter(slot =>
      slot.value > new Date(startTimeValue)
    );
  }



  formatTimeSlot(dateTime: Date): string {
    return dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  saveAppointment(): void {
    const value = this.appointmentForm.value;
    if (!value.endTime || !value.startTime) return;

    const appointmentData: any = {
      ...value,
      startTime: new Date(value.startTime),
      endTime: new Date(value.endTime)
    };

    this.service.updateAppointment(this.appointment.id!, appointmentData);
    this.dialog.closeAll();

    console.log('Appointment saved:', appointmentData);
  }
}
