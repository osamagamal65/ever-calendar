import { TimeSlot } from "../../interfaces/time-slot.interface";

export const generateQuarterHoursTimeSlots = (day: Date): TimeSlot[] => {
  return Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    const date = new Date(day);
    date.setHours(hour, minutes, 0, 0);
    return { day: day, hour, minutes, value: date };
  });
}

export const generateHalfHoursTimeSlots = (day: Date): TimeSlot[] => {
  return Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = (i % 4) * 30;
    const date = new Date(day);
    date.setHours(hour, minutes, 0, 0);
    return { day: day, hour, minutes, value: date };
  });
}
export const generateTimeSlots = (day: Date): TimeSlot[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const date = new Date(day);
    date.setHours(i, 0, 0, 0);
    return { day: day, hour: i, minutes: 0, value: date };
  });
}

export const generateWeekDates = (inputDate: Date): Date[] => {
  const date = new Date(inputDate);
  // Set the time to midnight to avoid issues with daylight saving time changes
  date.setHours(0, 0, 0, 0);
  // Get the current day of the week, adjust to make Monday the first day
  const dayOfWeek = (date.getDay() + 6) % 7;
  // Calculate the date of the nearest Monday
  date.setDate(date.getDate() - dayOfWeek);

  // Generate dates for the week
  return Array.from({ length: 7 }, (_, i) => {
    const weekDate = new Date(date);
    weekDate.setDate(date.getDate() + i);
    return weekDate;
  });
}
