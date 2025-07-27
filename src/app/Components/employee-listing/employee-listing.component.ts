  declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeListingPaginationService } from '../../shared/services/AdminServices/employee-listing-pagination.service';
import { AdminServiceService } from '../../shared/services/AdminServices/admin-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogeComponent } from '../Snackbar/confirm-dialoge/confirm-dialoge.component';
import { Router} from '@angular/router';


@Component({
  selector: 'app-employee-listing',
  standalone: true,
  imports: [CommonModule,FormsModule,ConfirmDialogeComponent],
  templateUrl: './employee-listing.component.html',
  styleUrl: './employee-listing.component.css'
})
export class EmployeeListingComponent implements OnInit {
  
  employees: Employee[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages = 1;
  sortField: string = '';
  sortAscending: boolean = true;
  selectedSignature: string = '';

  filters = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  nationalID: '',
  age: null
};

  constructor(private employeeService: EmployeeListingPaginationService , private adminService : AdminServiceService,
    private snackBar: MatSnackBar,private dialog: MatDialog, private router:Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.employees = res.items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  nextPage(): void {
    if ((this.pageNumber * this.pageSize) < this.totalCount) {
      this.pageNumber++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadEmployees();
    }
  }

   onPageSizeChange(): void {
    this.pageNumber = 1; 
    this.loadEmployees();
  }

  editEmployee(emp: any) {
  // Navigate to edit form or open modal
  this.router.navigate(['edit-employee', emp.employeeID]);
}

deleteEmployee(emp: any) {
  if (!emp.employeeID) {
    console.error('Employee ID is undefined!');
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogeComponent, {
    data: { message: 'Are you sure you want to delete this employee?' },
    width: '550px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.adminService.deleteEmployee(emp).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success','mb-5'],
            verticalPosition: 'bottom',
            horizontalPosition: 'end',
          });
          this.loadEmployees(); // Reload employees after deletion
        },
        error: (err) => {
          const errorMessage = err?.error || 'Deletion failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error','mb-5'],
            verticalPosition: 'bottom',
            horizontalPosition: 'end',
          });
        },
      });
    }
  });
}

applyFilters(): void {
  this.employeeService.getFilteredEmployees(this.filters, this.pageNumber, this.pageSize)
    .subscribe({
      next: (res) => {
        this.employees = res.items || [];
        this.totalCount = res.totalCount || 0;
        this.totalPages = res.totalPages || 1;
      },
      error: (err) => {
        console.error('Failed to load filtered Employees', err);
        this.snackBar.open('Error loading employees', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
}


sortBy(field: string) {
  if (this.sortField === field) {
    this.sortAscending = !this.sortAscending; // Toggle direction
  } else {
    this.sortField = field;
    this.sortAscending = true;
  }

  this.employees.sort((a: any, b: any) => {
    const valueA = a[field];
    const valueB = b[field];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return this.sortAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return this.sortAscending ? valueA - valueB : valueB - valueA;
  });
}

viewSignature(emp: any) {
  let trimmed = emp.signature.split('_Email')[0];
  this.selectedSignature = `https://localhost:7063/${trimmed}`;
  const modal = new bootstrap.Modal(document.getElementById('signatureModal')!);
  modal.show();
}


}
