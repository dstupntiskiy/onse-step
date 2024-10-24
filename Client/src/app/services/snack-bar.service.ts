import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  success(message: string){
    this.snackBar.open(message, 'Закрыть', {duration: 3000})
  }

  error(message: string){
    this.snackBar.open(message, 'Закрыть', {duration: 10000})
  }
}
