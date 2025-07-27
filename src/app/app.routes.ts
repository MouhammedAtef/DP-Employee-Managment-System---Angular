import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/Admin-Layout/admin-layout/dashboard.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { EmployeeLayoutComponent } from './Components/layout/employee-layout/employee-layout.component';
import { CheckInHistoryComponent } from './Components/check-in-history/check-in-history.component';
import { WeeklyAttendanceComponent } from './Components/weekly-attendance/weekly-attendance.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { adminGuard } from './guards/admin.guard';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
import { CreateEmployeeFormComponent } from './Components/create-employee-form/create-employee-form.component';
import { EmployeeListingComponent } from './Components/employee-listing/employee-listing.component';
import { EditEmployeeComponent } from './Components/AdminEditEmployee/edit-employee.component';
import { AttendanceDailyListComponent } from './Components/attendance-daily-list/attendance-daily-list.component';
import { ForgetpasswordComponent } from './Components/forget/forget.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { employeeGuard } from './guards/employee.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'forget', component: ForgetpasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    {
        path: 'profile', component: EmployeeLayoutComponent, canActivate: [employeeGuard],
        children: [
            { path: '', component: EmployeeComponent },
            { path: 'check-in-history', component: CheckInHistoryComponent },
            { path: 'change-password', component: ChangePasswordComponent },
            { path: 'WeeklyAttendance', component: WeeklyAttendanceComponent },
        ]
    },
    { path: 'login', component: LoginComponent },
    //{ path: 'dashboard', component: DashboardComponent,canActivate: [adminGuard] },
    { path: 'unauthorized', component: UnauthorizedComponent },

    {
        path: 'Admin-LayOut', component: DashboardComponent, canActivate: [adminGuard],
        children: [
            { path: '', component: CreateEmployeeFormComponent },
            { path: 'All-Employee', component: EmployeeListingComponent },
            { path: 'AttendanceDailyList', component: AttendanceDailyListComponent },
            
        ]
    },
    { path: 'edit-employee/:id', component: EditEmployeeComponent , canActivate: [adminGuard]},
    


];
