import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from './spinner.service';
import { Observable, pipe } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule, 
    CommonModule],
  providers:[
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

  public isLoading$: Observable<boolean>;

  constructor(private spinnerService: SpinnerService){
    this.isLoading$ = this.spinnerService.loading$;
  }
}
