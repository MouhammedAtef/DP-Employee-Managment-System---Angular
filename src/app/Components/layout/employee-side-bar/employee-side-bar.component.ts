import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CheckInServiceService } from '../../../shared/services/EmployeeService/check-in-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonalInformationService } from '../../../shared/services/EmployeeService/personal-information.service';
import { ImageServiceService } from '../../../shared/services/AdminServices/image-service.service'; 


  export interface CheckInResponse {
    message: string;
  }

@Component({
  selector: 'app-employee-side-bar',
  imports: [RouterModule,CommonModule],
  templateUrl: './employee-side-bar.component.html',
  styleUrl: './employee-side-bar.component.css'
})
export class EmployeeSideBarComponent implements OnInit {
  @ViewChild('fileInput') uploadInput!: ElementRef;
  isCheckedIn: boolean = false;
  constructor(
    private router: Router,
    private apiService: CheckInServiceService,
    private snackBar: MatSnackBar,
    private personalInformationService: PersonalInformationService,
    private imageService: ImageServiceService
  ) {}
  
  ngOnInit() {
    const storedValue = localStorage.getItem('isCheckedIn');
    this.isCheckedIn = storedValue === 'true' ? true : false;
    console.log(storedValue, this.isCheckedIn);
  }


  onCheckIn() {
  this.apiService.checkIn().subscribe({
    next: (res) => {
      console.log('Success Response:', res);
      this.isCheckedIn = true;
      localStorage.setItem('isCheckedIn', JSON.stringify(this.isCheckedIn));
      console.log(this.isCheckedIn);
      try {
        this.snackBar.open(res.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success','mb-5'],
          verticalPosition: 'bottom',
          horizontalPosition: 'end',
        });
      } catch (snackError) {
        console.error('Snackbar Error:', snackError);
      }
    },
    error: (err) => {
      console.error('Check-In failed:', err);
      const errorMessage = err?.error || 'Check-In failed. Please try again.';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error','mb-5'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    },
  });
}

onCheckOut() {
  this.apiService.checkOut().subscribe({
    next: (res) => {
      console.log('0');
      console.log('Success Response:', res);
      this.isCheckedIn = false;
      console.log(this.isCheckedIn);
      localStorage.setItem('isCheckedIn', JSON.stringify(this.isCheckedIn));
      try {
      console.log('1');
        this.snackBar.open(res.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success','mb-5'],
          verticalPosition: 'bottom',
          horizontalPosition: 'end',
        });
      } catch (snackError) {
      console.log('2');
        console.error('Snackbar Error:', snackError);
      }
    },
    error: (err) => {
      console.log('3');
      console.error('Check-Out failed:', err);
      const errorMessage = err?.error || 'Check-Out failed. Please try again.';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error','mb-5'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    },
  });
}


  onSignOut() {
  //Clear local storage 
  localStorage.clear();

  //navigate to login page
  this.router.navigate(['/login']);
}

}
