import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragStart,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Appointment } from '../../interfaces/appointment.interface';
import { MatIcon } from "@angular/material/icon";
import { MatRipple } from '@angular/material/core';
import { AppointmentsService } from '../../core/services/appointments.service';
import { generateTimeSlots } from '../../core/helpers/time-slots';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [CommonModule, MatGridListModule, MatRipple, CdkDrag, DragDropModule, CdkDropList, MatIcon],
})
export class CalendarComponent implements OnInit {
  @Input({ required: true })
  month: Date = new Date();

  service = inject(AppointmentsService)
  days: { [key: string]: Appointment[] } = {};
  dragging: boolean = false;

  constructor(private dialog: MatDialog) {
    this.generateDaysForCurrentMonth().forEach((e) => {
      this.days[e.toISOString()] = [];
    })
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.getAppointments();
    }, 2000);
  }

  openEditModal(appointment: Appointment) {
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      width: '250px',
      data: { appointment  }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAppointments();
    });
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

  generateDaysForCurrentMonth(): Date[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  }

  dropAtDay(event: any, day: Date) {
    console.log(event);
    if (event.previousContainer === event.container) {
      const prevIndex = event.previousIndex;
      const newIndex = event.currentIndex;

      moveItemInArray(this.days[day.toISOString()], event.previousIndex, event.currentIndex);

    }
  }

  dragStarted(appointment: Appointment, event: CdkDragStart) {
    console.log('Drag started', appointment);

    console.log(event);
  }

  openDialogToAddAppointment(day: Date) {
    const dialogRef = this.dialog.open(AddAppointmentComponent, {
      width: '250px',
      data: { day: day }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      this.getAppointments();

    });
  }

  getAppointmentsByDate(date: Date): Appointment[] {
    return this.days[date.toISOString()].filter(appointment =>
      appointment.startTime.getDate() === date.getDate() &&
      appointment.startTime.getMonth() === date.getMonth() &&
      appointment.startTime.getFullYear() === date.getFullYear()
    );
  }


  get daysOfTheMonth(): Date[] {
    return Object.keys(this.days).map((e) => new Date(e));
  }


  getDayTimeSlot(date: Date) {
    return generateTimeSlots(date);
  }
}
