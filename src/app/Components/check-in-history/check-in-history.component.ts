import { Component, OnInit } from '@angular/core';
import { AttendanceLog, AttendanceService } from '../../shared/services/EmployeeService/attendance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-in-history',
  imports: [CommonModule],
  templateUrl: './check-in-history.component.html',
  styleUrl: './check-in-history.component.css'
})
export class CheckInHistoryComponent implements OnInit {
  attendanceLogs: AttendanceLog[] = [];
  errorMessage = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
  this.attendanceService.getAttendanceLog().subscribe({
    next: (logs) => {
      // Sort logs by date (newest first)
      this.attendanceLogs = logs.sort((a, b) => {
        return new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime();
      });
    },
    error: (err) => this.errorMessage = 'Failed to load attendance log.'
  });
}


  formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

getTotalHours(checkIn: string, checkOut: string | null): string {
  if (!checkOut) return '—';

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const diffMs = outDate.getTime() - inDate.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  const hours = Math.floor(diffHrs);
  const minutes = Math.round((diffHrs - hours) * 60);

  return `${hours}h ${minutes}m`;
}
}
