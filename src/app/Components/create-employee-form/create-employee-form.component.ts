import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../../shared/services/AdminServices/admin-service.service';
import { ImageServiceService } from '../../shared/services/AdminServices/image-service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-create-employee-form',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-employee-form.component.html',
  styleUrl: './create-employee-form.component.css'
})
export class CreateEmployeeFormComponent {
  employeeForm: FormGroup;
  errorMessages: string[] = [];
  successMessage: string = '';
  signatureVal: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminServiceService, private imageService: ImageServiceService, private router: Router) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalID: ['', [
        Validators.required,
        Validators.pattern(/^\d{14}$/) // exactly 16 digits
      ]],
      signature: [''],
      age: [null, [Validators.required, Validators.min(18)]],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';
    this.signatureVal = `${this.employeeForm.value["signature"]}_Email_${this.employeeForm.value["email"]}`
    this.employeeForm.patchValue({ signature: this.signatureVal });
    if (this.employeeForm.invalid) {
      this.errorMessages.push('Please fix the errors in the form.');
      return;
    }

    this.adminService.createEmployee(this.employeeForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Employee created successfully!';
        this.employeeForm.reset();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.length) {
          this.errorMessages = err.error.map((e: any) => e.errorMessage || e);
        } else {
          this.errorMessages = ['An unexpected error occurred.'];
        }
      }
    });

  }

 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('image', file); // ✅ Must match "image" in controller

    this.imageService.uploadImage(formData).subscribe({
      next: (res) => {
        console.log('Upload successful:', res);
        this.employeeForm.patchValue({ signature: res.fileName }); // optionally set the signature field
      },
      error: (err) => {
        console.error('Upload failed:', err);
      }
    });
  }
}

  get firstName() { return this.employeeForm.get('firstName')!; }
  get lastName() { return this.employeeForm.get('lastName')!; }     
  get nationalID() { return this.employeeForm.get('nationalID')!; }
  get signature() { return this.employeeForm.get('signature')!; }
  get age() { return this.employeeForm.get('age')!; }
  get userName() { return this.employeeForm.get('userName')!; }
  get email() { return this.employeeForm.get('email')!; }
  get phoneNumber() { return this.employeeForm.get('phoneNumber')!; }
  get password() { return this.employeeForm.get('password')!; }
  get confirmPassword() { return this.employeeForm.get('confirmPassword')!; }
}
