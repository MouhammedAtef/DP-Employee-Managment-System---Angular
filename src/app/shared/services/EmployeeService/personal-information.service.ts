import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonalInformationService {

 private PersonalInformation = 'https://localhost:7063/api/Employee'; 

  constructor(private http: HttpClient) {}

  getPersonalInformation() {
    return this.http.get<{ userDto: any, message: string }>(`${this.PersonalInformation}/Personal-information`);
  }

   updateSignature(signatureData: string): Observable<any> {
  // Create form data as your API expects a form-encoded request
  const formData = new FormData();
  formData.append('signature', signatureData);
  
  return this.http.put(`${this.PersonalInformation}/UpdateSignature`, formData, {
    headers: {
      'enctype': 'multipart/form-data'
    }
  });
}
}
