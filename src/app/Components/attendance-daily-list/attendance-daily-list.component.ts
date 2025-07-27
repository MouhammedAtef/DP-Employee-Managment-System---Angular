import { AdminServiceService } from '../../shared/services/AdminServices/admin-service.service'; 
import { Component, OnInit } from '@angular/core';
import { DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-attendance-daily-list',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    HttpClientModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './attendance-daily-list.component.html',
  styleUrl: './attendance-daily-list.component.css',
  providers: [DatePipe]
})
export class AttendanceDailyListComponent implements OnInit {
  selectedDate: string;
  attendanceData: any[] = [];
  maxWeeklyHours = 40; 
  isLoading = false;
  nameFilter: string = '';
  originalData: any[] = [];

  constructor(
    private adminService: AdminServiceService,
    private datePipe: DatePipe
  ) {
    // Set startdate to today's date
    const today = new Date();
    this.selectedDate = this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.loadAttendanceData();
  }

  loadAttendanceData(): void {
    this.isLoading = true;
    const date = new Date(this.selectedDate);
    
    this.adminService.getDailyAttendanceList(date).subscribe({
      next: (data) => {
        console.log(data)
        this.attendanceData = Array.isArray(data) ? data : [];
        this.originalData = [...this.attendanceData]; // Store original data for filtering
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading attendance data', err);
        this.attendanceData = [];
        this.originalData = [];
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    this.loadAttendanceData();
  }

  changeDate(days: number): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + days);
    this.selectedDate = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    this.loadAttendanceData();
  }

  // Helper method to safely calculate percentage
  calculatePercentage(hours: number): number {
    if (!hours || !this.maxWeeklyHours) return 0;
    return (hours / this.maxWeeklyHours) * 100;
  }

  filterEmployees() {
  if (!this.nameFilter) {
    this.attendanceData = [...this.originalData]; // Restore original data
    return;
  }
  this.attendanceData = this.originalData.filter(employee => 
    employee.employeeName.toLowerCase().includes(this.nameFilter.toLowerCase())
  );
  }
}