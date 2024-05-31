import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimelineViewComponent } from '../timeline-view/timeline-view.component';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CalendarComponent, TimelineViewComponent, RouterOutlet,
    CommonModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatInputModule
  ],
  providers: [provideNativeDateAdapter()],

})
export class HomeComponent {
  selectedDate = new Date();
  mode: 'monthly' | 'daily' | 'weekly' = 'monthly';
  constructor(private router: Router) {

  }

  changeChild(event: 'monthly' | 'daily' | 'weekly') {
    this.mode = event;
    this.router.navigateByUrl('/home/' + this.mode);
  }
}
