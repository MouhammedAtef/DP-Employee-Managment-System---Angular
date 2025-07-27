import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangePasswordService } from '../../shared/services/EmployeeService/change-password.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  message = '';
  errorMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(field: 'current' | 'new') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else {
      this.showNewPassword = !this.showNewPassword;
    }
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) return;

    this.message = '';
    this.errorMessage = '';

    this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.message = 'Password changed successfully.';
        this.changePasswordForm.reset();
      },
      error: () => {
        this.errorMessage = 'Something went wrong.';
      }
    });
  }
}
