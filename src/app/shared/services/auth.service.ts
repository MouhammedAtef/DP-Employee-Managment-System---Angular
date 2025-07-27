import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';



export interface LoginResponse {
  token: string;
  refreshToken: string;
  userRole: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private refreshUrl = 'https://localhost:7063/api/Account/refreshToken';
  private apiUrl = 'https://localhost:7063/api/Account/Login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    console.log("Sending login request with body:", body);
    console.log("API URL:", this.apiUrl);
    return this.http.post<LoginResponse>(this.apiUrl, body);
  }


  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<{ token: string, refreshToken: string }> {
    return this.http.post<{ token: string, refreshToken: string }>(
      this.refreshUrl,
      { refreshToken: this.getRefreshToken() }
    );
  }

  saveTokens(access: string, refresh: string) {
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
  }

  // getCurrentUser() {
  //     const token = localStorage.getItem('token');
  //     if (!token) return null;

  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       return payload;
  //     } catch (e) {
  //       return null;
  //     }
  //   }

  //   isAdmin(): boolean {
  //     const user = this.getCurrentUser();
  //     return user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
  //   }
  getCurrentUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      return payload[roleClaim] || null;
    } catch {
      return null;
    }
  }
}
