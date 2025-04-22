import { LocalMedication } from "@shared/schema";
import { formatTime } from "./utils";

// Check if notifications are supported and permissions are granted
export async function checkNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Send a notification for a medication
export function sendMedicationNotification(medication: LocalMedication, scheduleTime: string): void {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    const formattedTime = formatTime(scheduleTime);
    const notification = new Notification('Time to take your medication!', {
      body: `${medication.name} - ${medication.dosage} at ${formattedTime}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Schedule medication notifications for the day
export function scheduleNotifications(medications: LocalMedication[]): void {
  if (!checkNotificationPermission()) {
    return;
  }
  
  const today = new Date();
  const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday from 0 to 7
  
  // Cancel any existing scheduled notifications
  const scheduledNotifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
  scheduledNotifications.forEach((timeoutId: number) => {
    clearTimeout(timeoutId);
  });
  
  const newScheduledNotifications: number[] = [];
  
  medications.forEach(medication => {
    medication.schedule.forEach(schedule => {
      // Check if medication should be taken today
      if (schedule.days.includes(currentDay)) {
        const [hours, minutes] = schedule.time.split(':').map(Number);
        
        const scheduleDate = new Date();
        scheduleDate.setHours(hours, minutes, 0, 0);
        
        // Only schedule notifications for future times today
        if (scheduleDate > today) {
          const delay = scheduleDate.getTime() - today.getTime();
          
          const timeoutId = window.setTimeout(() => {
            sendMedicationNotification(medication, schedule.time);
          }, delay);
          
          newScheduledNotifications.push(timeoutId);
        }
      }
    });
  });
  
  // Save the scheduled notification timeouts
  localStorage.setItem('scheduled_notifications', JSON.stringify(newScheduledNotifications));
}
