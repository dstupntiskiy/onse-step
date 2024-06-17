import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
  router = inject(Router);
  constructor(private dialog: MatDialog){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.dialog.closeAll()
          localStorage.removeItem('jwtToken')
          this.router.navigate(['/login'])
        }
        return throwError(error);
      })
    )
  }
};