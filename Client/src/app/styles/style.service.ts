import { Injectable } from '@angular/core';
import { BaseHttpService } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { Observable } from 'rxjs';
import { StyleModel } from '../shared/models/style-model';

@Injectable({
  providedIn: 'root'
})
export class StyleService extends BaseHttpService {
  protected override route: string = 'style';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
  }

  getAllStyles(): Observable<StyleModel[]>{
    return this.get<StyleModel[]>('GetAll')
  }

  saveStyle(style: StyleModel) : Observable<StyleModel>{
    return this.post<StyleModel>('', style)
  }
}
