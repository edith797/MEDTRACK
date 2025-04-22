import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDayName(day: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[day - 1];
}

export function getDayShortName(day: number): string {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[day - 1];
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function generateRandomColor(): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0-6 (Sunday-Saturday)
  
  // Adjust for week starting on Monday
  const diff = day === 0 ? 6 : day - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
}

export function isTimeInFuture(timeString: string): boolean {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const timeToCheck = new Date();
  timeToCheck.setHours(hours, minutes, 0);
  return timeToCheck > now;
}

export function getShortDateStr(date: Date): string {
  return format(date, 'MM/dd');
}
