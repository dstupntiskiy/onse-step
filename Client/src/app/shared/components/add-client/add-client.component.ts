import { Component, inject, input, model, output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../../models/client-model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { options } from '@fullcalendar/core/preact';
import { BehaviorSubject, Observable, catchError, debounceTime, filter, of, switchMap } from 'rxjs';
import { SnackBarService } from '../../../services/snack-bar.service';
import { ClientService } from '../../../clients/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers:[
    ClientService
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {
  public clientControl = new FormControl()
  selectedClient?: Client
  selectedClient$$ = output<Client>() 
  filteredOptions$: Observable<Client[]>

  snackbarService = inject(SnackBarService)
  clientService = inject(ClientService)

  clearControl = input<BehaviorSubject<boolean>>()

  ngOnInit(){
    this.clearControl()?.subscribe((result: boolean) =>
      {
        if(result){
          this.clientControl.reset('')
        }
      })
    this.filteredOptions$ = this.clientControl.valueChanges.pipe(
      debounceTime(300),
      filter(value =>{
        if(value === ''){
          return false
        }
        return true
      }),
      switchMap(value => this.clientService.getClientsByQuery(value).pipe(
        catchError(error => {
          this.snackbarService.error("Не удалось выполнить поиск");
          return of([])
        })
      ))
    )
  }

  public displayFn(client: Client): string{
    return client && client.name ? client.name : '';
  }

  public onOptionSelected(){
    this.selectedClient = this.clientControl.value;
    this.selectedClient$$.emit(this.selectedClient as Client)
  }
}
