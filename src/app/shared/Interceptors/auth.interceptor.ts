import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError,switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const url = req.url;

  if (url.includes('/api/Account/Login') || url.includes('/api/Account/refreshToken')) {
    return next(req);
  }

  const refreshToken = localStorage.getItem('refreshToken');
  const token = localStorage.getItem('token')

  // If no token, proceed without modification
  if (!token) {
    return next(req);
  }

  // Check if token is expired
  const isExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  };

  // If token is valid, attach it
  if (!isExpired(token)) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  // If token is expired but refresh token exists, try refreshing
  if (refreshToken) {
    return authService.refreshToken().pipe(
      switchMap((res) => {
        authService.saveTokens(res.token, res.refreshToken);
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${res.token}` }
        });
        return next(cloned);
      }),
      catchError((err) => {
        // If refresh fails, clear tokens and proceed (or redirect to login)
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return next(req); // Or redirect: window.location.href = '/login';
      })
    );
  }

  // If no refresh token, proceed without auth header
  return next(req);
};
