import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, catchError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 private readonly router = inject(Router);
 private readonly dialog = inject(MatDialog);
 intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('jwtToken');
  const api = req.url.startsWith('/api/');
  const authorized = api && token && !req.url.includes('/User/Login') ? req.clone({setHeaders:{Authorization:'Bearer ' + token}}) : req;
  return next.handle(authorized).pipe(catchError(error => {
    if (api && error.status === 401 && !req.url.includes('/User/Login')) {
      this.dialog.closeAll(); localStorage.removeItem('jwtToken');
      this.router.navigateByUrl('/login');
    }
    return throwError(() => error);
  }));
 }
}