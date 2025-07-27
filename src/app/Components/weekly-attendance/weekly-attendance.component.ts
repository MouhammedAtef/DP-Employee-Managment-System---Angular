import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, AttendanceLog } from '../../shared/services/EmployeeService/attendance.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-weekly-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './weekly-attendance.component.html',
  styleUrls: ['./weekly-attendance.component.css'],
  providers: [DatePipe]
})
export class WeeklyAttendanceComponent implements OnInit {
  selectedDate: Date = new Date(); // Defaults to today's date
  dateInput: string; // For the date input binding
  dailyAttendanceData: AttendanceLog[] = [];
  filteredRecords: AttendanceLog[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private datePipe: DatePipe
  ) {
    // Format the date for the input field (YYYY-MM-DD)
    this.dateInput = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.dateInput = this.formatDateForInput(this.selectedDate);
    this.loadDailyAttendance();
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  changeDay(days: number): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + days);
    this.selectedDate = newDate;
    this.dateInput = this.formatDateForInput(newDate);
    this.loadDailyAttendance();
  }

  onDateChange(): void {
    this.selectedDate = new Date(this.dateInput);
    this.loadDailyAttendance();
  }

  loadDailyAttendance(): void {
    console.log(this.selectedDate);
    this.attendanceService.getWeeklyAttendance(this.selectedDate)
      .subscribe({
        next: (data) => {
         this.dailyAttendanceData = data.sort((a, b) => 
            new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime()
          );
          this.filteredRecords = [...this.dailyAttendanceData];
        },
        error: (err) => {
          console.error('Failed to load attendance data:', err);
          this.dailyAttendanceData = [];
          this.filteredRecords = [];
        }
      });
  }

  calculateWorkingHours(checkIn: string, checkOut: string | null): string {
    if (!checkOut) return '-';
    
    const inTime = new Date(checkIn);
    const outTime = new Date(checkOut);
    const diffMs = outTime.getTime() - inTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  getDayName(dateString: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  return days[date.getDay()];
}

}