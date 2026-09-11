import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { catchError, map, of } from 'rxjs';
export const authGuard: CanActivateFn = () => localStorage.getItem('jwtToken') ? true : inject(Router).createUrlTree(['/login']);
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(UserService).isSuperAdmin().pipe(map(allowed => allowed || router.createUrlTree(['/'])), catchError(() => of(router.createUrlTree(['/']))));
};
