import { Component, computed, effect, inject, input, output, OutputRefSubscription, signal, Signal, viewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client, ClientOnetimeVisit } from '../../shared/models/client-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { ClientService } from '../client.service';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SnackBarService } from '../../services/snack-bar.service';
import { DialogService } from '../../services/dialog.service';
import { MembershipDialogComponent } from '../../membership/membership-dialog/membership-dialog.component';
import { MembershipWithDetails } from '../../shared/models/membership-model';
import { MembershipService } from '../../membership/membership.service';
import { MembershipComponent } from '../../membership/membership.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe, DatePipe } from '@angular/common';

export interface ClientDialogData{
  id: string
}

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MembershipComponent,
    SpinnerComponent,
    MatTabsModule,
    AsyncPipe,
    DatePipe
  ],
  providers:[
    SnackBarService
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {
  isLoading : boolean = false
  title = computed<string>(() =>{
    if(this.client()?.name)
      return this.client()?.name as string
    return 'Клиент'
  })

  public form: FormGroup;
  public get name() { return this.form.get('name')}
  public get phone() { return this.form.get('phone')}
  public get socialMediaLink() { return this.form.get('socialMediaLink')}
  data = input.required<ClientDialogData | null>()
  client = signal<Client | undefined>(undefined)

  dialogService = inject(DialogService)
  memberships: MembershipWithDetails[] = []
  membershipService = inject(MembershipService)
  clientService = inject(ClientService)

  clientSave = output<Client>()
  clientDelete = output<string>()

  onetimeVisits = computed(() => this.data()?.id != undefined 
    ? this.clientService.getClientOnetimeVisits(this.data()?.id as string)
    : of([]) )

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    private spinnerService: SpinnerService,
  ){
    effect(() =>{
      if(this.data()?.id)
      {
        this.isLoading = true
        this.clientService.getClientById(this.data()?.id as string)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe((result: Client) => {
            if(result)
            {
              this.client.set(result)
              this.name?.setValue(result.name)
              this.phone?.setValue(result.phone)
              this.socialMediaLink?.setValue(result.socialMediaLink)

              this.updateMemberships()
            }
          })
      
      }
    })
  }

    ngOnInit(){
      this.form = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        phone: new FormControl(''),
        socialMediaLink: new FormControl('')
      })
    }

    onCloseClick(){
      this.dialogRef.close();
    }

    onDeleteClick(){
      this.dialogService.showDialog(ConfirmationDialogComponent, { message: 'Удалить клиента?'})
        .afterClosed().subscribe(reuslt =>{
          if(reuslt){
            this.clientService.deleteClient(this.client()?.id as string)
              .subscribe((result : string) =>{
                if(result){
                  this.clientDelete.emit(result)
                  this.dialogRef.close()
                }
              })
          }
        })
    }

    onAddMembershipClick(){
      this.dialogService.showDialog(MembershipDialogComponent, {
        client: this.client()
      })
      .afterClosed().subscribe((result: MembershipWithDetails) =>{
        if(result){
          this.memberships.unshift(result)
        }
      })
    }

    submit(){
      if (this.form.valid){
        const client: Client = {
          id: this.client()?.id as string,
          name: this.name?.value,
          phone: this.phone?.value,
          socialMediaLink: this.socialMediaLink?.value
        }
        this.spinnerService.loadingOn()
        this.clientService.saveClient(client)
        .pipe(
          finalize(()=> this.spinnerService.loadingOff())
        )
        .subscribe((result: Client) =>{
          this.client.set(result)
          this.updateMemberships()
          this.clientSave.emit(result)
        })
      }
    }

    onMembershipDelete(id: string){
      this.memberships = this.memberships.filter(x => x.id != id)
    }

    private updateMemberships(){
      this.membershipService.getMembershipsByClient(this.client()?.id as string)
          .subscribe((result: MembershipWithDetails[]) =>{
            this.memberships = result
          })
    }
}
