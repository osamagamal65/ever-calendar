import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentsService } from './core/services/appointments.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private service: AppointmentsService) { }

  ngOnInit(): void {
    this.openingDb();
  }

  openingDb() {
    this.service.openDB();
  }
}
