import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private changePasswordurl = 'https://localhost:7063/api/Employee/change-password'; 

  constructor(private http: HttpClient) {}

  changePassword(model: ChangePasswordDTO): Observable<any> {
    return this.http.post(this.changePasswordurl, model);
  }
}
