import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { UserService } from '../shared/services/user.service';


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
    const message = error.status === 0 || error.status >= 500
      ? 'Сервер недоступен. Попробуйте ещё раз.'
      : error.status === 403 ? 'У вас нет прав на это действие'
      : error.status === 401 ? 'Проверьте данные для входа'
      : typeof error.error === 'string' ? error.error
      : error.error?.message || 'Не удалось выполнить действие';
    this.snackbarService.error(message);
    return throwError(() => error);
  }
}

