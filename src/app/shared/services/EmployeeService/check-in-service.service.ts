import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CheckInResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckInServiceService {
  private baseUrl = 'https://localhost:7063/api/Employee';

  constructor(private http: HttpClient) {}

  checkIn(): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(`${this.baseUrl}/CheckIn`, {});
  }

  checkOut(): Observable<CheckInResponse> {
    return this.http.put<CheckInResponse>(`${this.baseUrl}/CheckOut`, {});
  }
}
