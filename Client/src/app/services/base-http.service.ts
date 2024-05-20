import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  protected get<TResult>(method: string, options?: IAngularHttpRequestOptions) : Observable<TResult>{
    return this.http.get<TResult>(`${this.base}/${this.route}/${method}`, options);
  }

  protected post<TResult, TData = {}>(
    method: string,
    data?: TData,
    options?: IAngularHttpRequestOptions
): Observable<TResult> {
    return this.http.post<TResult>(`${this.base}/${this.route}/${method}`, data, options);
}

protected delete<TResult>(method: string, options?: IAngularHttpRequestOptions): Observable<TResult> {
    return this.http.delete<TResult>(`${this.base}/${this.route}/${method}`, options);
}
}
