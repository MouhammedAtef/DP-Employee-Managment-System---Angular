import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AttendanceLog {
  checkInTime: string;
  checkOutTime: string | null;
  dayName: string;
  employeeId: number;
}


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = 'https://localhost:7063/api/Employee'; 

  constructor(private http: HttpClient) {}

  getAttendanceLog(): Observable<AttendanceLog[]> {
    return this.http.get<AttendanceLog[]>(`${this.baseUrl}/AttendanceLog`);
  }

 getWeeklyAttendance(date: Date): Observable<AttendanceLog[]> {
  if (!date) throw new Error('Date is required');
  
  // Create ISO string without timezone conversion
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
  
  const dateTimeString = localDate.toISOString();

  return this.http.get<AttendanceLog[]>(
    `${this.baseUrl}/WeeklyAttendanceLog`, 
    {
      params: {
        dateTime: dateTimeString
      }
    }
  );
}
}
