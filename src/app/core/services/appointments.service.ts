import { Injectable } from '@angular/core';
import { Appointment } from '../../interfaces/appointment.interface';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private db?: IDBDatabase;

  openDB() {
    const request = indexedDB.open('appointmentsDB', 1);

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      if (!this.db.objectStoreNames.contains('appointments')) {
        this.db.createObjectStore('appointments', { autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
    };
  }


  saveAppointment(appointment: Appointment): void {
    const transaction = this.db!.transaction(['appointments'], 'readwrite');
    const store = transaction.objectStore('appointments');
    const request = store.add(appointment, appointment.id);

    request.onsuccess = () => {
      console.log('Appointment saved:', appointment);
    };

    request.onerror = (event: any) => {
      console.error('Error saving appointment:', (event.target as IDBRequest).error);
    };
  }

  getAllAppointments(): Promise<Appointment[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const request = store.openCursor();
      const appointments: Appointment[] = [];

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          appointments.push(cursor.value);
          cursor.continue();
        } else {
          resolve(appointments);
        }
      };

      request.onerror = (event: any) => {
        console.error('Error fetching appointments:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  updateAppointment(id: number, updatedAppointment: Appointment): Promise<void> {
    if (!this.db) throw ('DB is not available ');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readwrite');
      const store = transaction.objectStore('appointments');
      const request = store.put(updatedAppointment, id);


      request.onsuccess = () => {
        console.log('Appointment updated:', updatedAppointment);
        resolve();
      };

      request.onerror = (event: any) => {
        console.error('Error updating appointment:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  getAppointmentById(id: number): Promise<Appointment | undefined> {
    if (!this.db) throw ('DB is not available ');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          console.log('Appointment fetched:', request.result);
          resolve(request.result);
        } else {
          console.log('No appointment found with ID:', id);
          resolve(undefined);
        }
      };

      request.onerror = (event: any) => {
        console.error('Error fetching appointment by ID:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  getAppointmentsByMonth(date: Date): Promise<Appointment[]> {
    if (!this.db) throw ('DB is not available ');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const request = store.openCursor();
      const appointments: Appointment[] = [];
      const targetMonth = date.getMonth();
      const targetYear = date.getFullYear();

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          const appointment: Appointment = cursor.value;
          const appointmentDate = new Date(appointment.date);
          if (appointmentDate.getMonth() === targetMonth && appointmentDate.getFullYear() === targetYear) {
            appointments.push(appointment);
          }
          cursor.continue();
        } else {
          resolve(appointments);
        }
      };

      request.onerror = (event: any) => {
        console.error('Error fetching appointments by month:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  getAppointmentsByDay(date: Date): Promise<Appointment[]> {
    if (!this.db) throw ('DB is not available ');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const request = store.openCursor();
      const appointments: Appointment[] = [];
      const targetDay = date.getDate();
      const targetMonth = date.getMonth();
      const targetYear = date.getFullYear();

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          const appointment: Appointment = cursor.value;
          const appointmentDate = new Date(appointment.date);
          if (appointmentDate.getDate() === targetDay &&
            appointmentDate.getMonth() === targetMonth &&
            appointmentDate.getFullYear() === targetYear) {
            appointments.push(appointment);
          }
          cursor.continue();
        } else {
          resolve(appointments);
        }
      };

      request.onerror = (event: any) => {
        console.error('Error fetching appointments by day:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }
}
