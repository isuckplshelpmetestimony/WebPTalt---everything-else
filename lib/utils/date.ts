import { format, formatDistance, isToday, isYesterday, startOfDay, addDays } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatRelativeDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDistance(date, new Date(), { addSuffix: true });
}

export function getDateOptions() {
  const today = startOfDay(new Date());
  return {
    today,
    yesterday: addDays(today, -1),
  };
}





