import { Component, OnInit } from '@angular/core';
import { EmployeeSideBarComponent } from "../layout/employee-side-bar/employee-side-bar.component";
import { CommonModule } from '@angular/common';
import { PersonalInformationService } from '../../shared/services/EmployeeService/personal-information.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeSideBarComponent,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
personalInfo: any;
  error: string = '';

  constructor(private employeeService: PersonalInformationService) {}

  ngOnInit(): void {
    this.employeeService.getPersonalInformation().subscribe({
      next: (res) => {
        this.personalInfo = res.userDto;
      },
      error: (err) => {
        this.error = err.error || 'Failed to fetch personal information.';
      }
    });
  }
}
