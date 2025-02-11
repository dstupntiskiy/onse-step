import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { UserService } from '../shared/services/user.service';
import { response } from 'express';

export interface IAngularHttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpService {
  protected abstract route: string;
  private readonly base = '/api'

  constructor(private http: HttpClient,
    private snackbarService: SnackBarService
  ) { }

  protected get<TResult>(method: string, options?: IAngularHttpRequestOptions) : Observable<TResult>{
    return this.http.get<TResult>(`${this.base}/${this.route}/${method}`, options)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  protected post<TResult, TData = {}>(
      method: string,
      data?: TData,
      options?: IAngularHttpRequestOptions
  ): Observable<TResult> {
      return this.http.post<TResult>(`${this.base}/${this.route}/${method}`, data, options)
        .pipe(
          catchError(this.handleError.bind(this))
        );
  }

  protected delete<TResult>(method: string, options?: IAngularHttpRequestOptions): Observable<TResult> {
    if(!options){
      options = { responseType: 'json'}
    }  
    return this.http.delete<TResult>(`${this.base}/${this.route}/${method}`, options)
        .pipe(
          catchError(this.handleError.bind(this))
        );
  }

  private handleError(error: HttpErrorResponse){
    if (error.status === 0){
      console.error("Произошла ошибка: ", error.error);
    }
    if (error.status === 403){
      this.snackbarService.error("У вас нет прав")
    }
    else if(!error.error)
    {
        this.snackbarService.error('Произошла неизвестная ошибка')
    }
    else 
    {
        this.snackbarService.error(error.error)
    }
    return throwError(() => new Error(error.error))
  }
}
