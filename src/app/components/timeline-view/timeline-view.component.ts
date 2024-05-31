import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { generateTimeSlots, generateWeekDates } from '../../core/helpers/time-slots';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { AppointmentsService } from '../../core/services/appointments.service';
import { TimeSlot } from '../../interfaces/time-slot.interface';
import { CdkDropListGroup, CdkDropList, CdkDrag, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';

@Component({
  standalone: true,
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrl: './timeline-view.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatGridListModule, MatRipple, MatIcon, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragHandle],

})
export class TimelineViewComponent {

  @Input({ required: true })
  date: Date = new Date();
  days: { [key: string]: Appointment[] } = {};
  service = inject(AppointmentsService)

  constructor(private dialog: MatDialog) {
    generateWeekDates(this.date).forEach((e) => {
      this.days[e.toISOString()] = [];
    })
  }

  getWeekDays(): Date[] {
    return Object.keys(this.days).map((x) => new Date(x));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getAppointments();
    }, 2000);
  }


  async getAppointments() {
    try {
      const appointments = await this.service.getAllAppointments();
      Object.keys(this.days).forEach((day) => {
        const date = new Date(day);
        this.days[day] = appointments.filter((e) =>
          e.startTime.getFullYear() === date.getFullYear()
          && e.startTime.getMonth() === date.getMonth() && e.startTime.getDay() === date.getDay());
      })
      console.log(this.days);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  }

  dropAtDay(event: any, day: Date) {
    console.log("Drag Dropped", event);
    moveItemInArray(this.days[day.toISOString()], event.previousIndex, event.currentIndex);
  }

  dragUpdate(event: any) {
    console.log(event);
  }

  dragEnd(event: any) {
    console.log('drag end ', event)
  }

  dragStarted(appointment: Appointment, event: any) {
    console.log(appointment);
    console.log(event);
  }

  openDialogToAddAppointment(day: Date) {
    const dialogRef = this.dialog.open(AddAppointmentComponent, {
      width: '250px',
      data: { day: day }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAppointments();
    });
  }

  openEditModal(appointment: Appointment) {
    console.log(appointment)
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      width: '250px',
      data: appointment
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAppointments();
    });
  }

  getAppointmentsByDate(date: Date): Appointment[] {
    return this.days[date.toISOString()].filter(appointment =>
      appointment.startTime.getHours() === date.getHours() &&
      appointment.startTime.getDate() === date.getDate() &&
      appointment.startTime.getMonth() === date.getMonth() &&
      appointment.startTime.getFullYear() === date.getFullYear()
    );
  }

  getAppointmentsByHour(date: Date): Appointment[] {
    if (!this.days || !this.days[date.toISOString()]) { return [] };
    return this.days[date.toISOString()].filter(appointment =>
      appointment.startTime.getHours() === date.getHours() &&
      appointment.startTime.getDate() === date.getDate() &&
      appointment.startTime.getMonth() === date.getMonth() &&
      appointment.startTime.getFullYear() === date.getFullYear()
    );
  }

  getDayTimeSlot(date = new Date()): TimeSlot[] {
    return generateTimeSlots(date);
  }


}
