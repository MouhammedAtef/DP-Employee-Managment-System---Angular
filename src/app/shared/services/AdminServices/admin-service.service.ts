import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private AdminUri = 'https://localhost:7063/api/Admin';

  constructor(private http: HttpClient) { }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.AdminUri}/Register`, employee);
  }

  deleteEmployee(emp: any): Observable<any> {
    return this.http.put(`${this.AdminUri}/DeleteEmployee/${emp.employeeID}`,{});
  }
  
  loadEmployeeData(empid:number): Observable<any> {
    return this.http.get<any>(`${this.AdminUri}/GetEmployeeById/${empid}`);  
  }

  updateEmployeeById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.AdminUri}/UpdateEmployee/${id}`, data);
  }

   getDailyAttendanceList(date: Date): Observable<any> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get(`${this.AdminUri}/DailyAttendanceList?dateTime=${formattedDate}`);
  }
}
