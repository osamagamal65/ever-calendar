import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TimelineViewComponent } from './components/timeline-view/timeline-view.component';

export const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    children: [
      {
        path: 'monthly',
        loadComponent: () => import('./components/calendar/calendar.component').then((x) => x.CalendarComponent)
      },
      {
        path: 'weekly',
        loadComponent: () => import('./components/timeline-view/timeline-view.component').then((x) => x.TimelineViewComponent)
      },
      {
        path: 'daily',
        loadComponent: () => import('./components/timeline-view/timeline-view.component').then((x) => x.TimelineViewComponent)
      }
    ]
  },
  {
    path: '', redirectTo: 'home/monthly', pathMatch: "full"
  }, {
    path: "**",
    redirectTo: 'home/monthly', pathMatch: "full"
  }
];
