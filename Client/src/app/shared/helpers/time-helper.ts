export function getFormattedTime(date: Date):string{
    date = new Date(date)
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

export function getHalfHourIntervals(): string[] {
    const intervals: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            intervals.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
        }
    }
    return intervals;
}

export function getHalfHourIntervalFromDate(date: Date): string{
    var date = new Date(date)
    const hours = date.getHours();
    const minutes = date.getMinutes() < 30 ? '00' : '30';
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}`;
}

export function setTimeFromStringToDate(date: Date, timeString: string): Date {
    const [hourStr, minuteStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    date = new Date(date)
    date.setHours(hour, minute);
    return date;
}

export function addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(date.getHours() + hours);
    return newDate;
}