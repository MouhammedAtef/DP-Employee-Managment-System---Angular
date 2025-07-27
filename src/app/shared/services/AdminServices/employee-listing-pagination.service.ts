import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalID: string;
  age: number;
  signature: string;
}

export interface PaginatedEmployees {
  items: Employee[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeListingPaginationService {

  private baseUrl = 'https://localhost:7063/api/Admin';

  constructor(private http: HttpClient) { }

  getAllEmployees(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedEmployees> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedEmployees>(`${this.baseUrl}/GetEmployees`, { params });
  }

  getFilteredEmployees(filters: any, pageNumber: number, pageSize: number): Observable<any> {
  // Convert filters to query parameters
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  // Add filter parameters if they exist
  if (filters.firstName) params = params.set('firstName', filters.firstName);
  if (filters.lastName) params = params.set('lastName', filters.lastName);
  if (filters.age) params = params.set('age', filters.age.toString());
  if (filters.phoneNumber) params = params.set('phoneNumber', filters.phoneNumber);
  if (filters.nationalID) params = params.set('nationalID', filters.nationalID);

  return this.http.get(`${this.baseUrl}/GetFilteredEmployees`, { params });
}
   
}
