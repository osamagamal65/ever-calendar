export interface Appointment {
  id?: number;
  title: string;
  description: string;
  location?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  attendees?: Array<{
      email: string;
      responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  recurrence?: string[];
  reminders?: {
      method: 'email' | 'popup';
      minutesBeforeStart: number;
  }[];
}
