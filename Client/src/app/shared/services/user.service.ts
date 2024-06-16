import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResults } from '../models/login-model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {

  protected override route: string = 'User';

  private isAthenticatedSubject = new BehaviorSubject<boolean>(false)
  isAuthenticated$ = this.isAthenticatedSubject.asObservable()

  constructor(http: HttpClient, 
    snackbarService: SnackBarService
  ) { super(http, snackbarService)}

  login(login: string, password: string): Observable<LoginResults>{
    var data = {
      login: login,
      password: password
    } 

    return this.post<LoginResults>('Login', data)
      .pipe(
        tap((value: LoginResults) =>{
          this.isAthenticatedSubject.next(true)
          this.storeToken(value.jwtToken)
        }))
  }

  private storeToken(token: string){
    localStorage.setItem('jwtToken', token)
  }
}
