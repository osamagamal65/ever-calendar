import { CdkDrag, CdkDropList, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { generateTimeSlots } from '../../core/helpers/time-slots';

@Component({
  standalone: true,
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrl: './timeline-view.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatGridListModule, MatRipple, CdkDrag, CdkDropList, MatIcon],

})
export class TimelineViewComponent {
  @Input({required: true})
  date: Date = new Date();

  getDayTimeSlot(date = new Date()) {
    return generateTimeSlots(date);
  }

}
