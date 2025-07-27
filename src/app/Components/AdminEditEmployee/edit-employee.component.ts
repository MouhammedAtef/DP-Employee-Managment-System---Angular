import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../shared/services/AdminServices/admin-service.service';
import { ImageServiceService } from '../../shared/services/AdminServices/image-service.service';


@Component({
  selector: 'app-edit-employee',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit{
  
  signatureVal: string = '';
  employeeForm!: FormGroup;
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminServiceService,
    private imageService: ImageServiceService
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.buildForm();
    this.loadEmployeeData();
  }

  buildForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      nationalID: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      signature: ['']
    });
  }

  Back(){
    console.log("afasdf")
    this.router.navigate(['/Admin-LayOut/All-Employee']);
  }

  loadEmployeeData() :void{
    this.adminService.loadEmployeeData(this.employeeId).subscribe({
      next: (res) => {
        if (res) {
          this.employeeForm.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            phoneNumber: res.phoneNumber,
            nationalID: res.nationalID,
            age: res.age,
            signature: res.signature
          });
        } else {
          this.router.navigate(['/unauthorized']);
        }  
      },
      error: (err) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;
    this.signatureVal = `${this.employeeForm.value["signature"]}_Email_${this.employeeForm.value["email"]}`
    this.employeeForm.patchValue({ signature: this.signatureVal });
    this.adminService.updateEmployeeById(this.employeeId,this.employeeForm.value)
      .subscribe({
        next: () => {
          alert('Employee updated successfully!');
          this.router.navigate(['/Admin-LayOut/All-Employee']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update employee');
        }
      });
  }

  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('image', file); 

    this.imageService.uploadImage(formData).subscribe({
      next: (res) => {
        console.log('Upload successful:', res);
        this.employeeForm.patchValue({ signature: res.fileName }); 
      },
      error: (err) => {
        console.error('Upload failed:', err);
      }
    });
  }
}
}
