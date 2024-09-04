import { Component, effect, inject, input, OutputRefSubscription, signal, Signal, viewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../shared/models/client-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { ClientService } from '../client.service';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
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
    SpinnerComponent
  ],
  providers:[
    ClientService,
    SnackBarService
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {
  isLoading : boolean = true

  public form: FormGroup;
  public get name() { return this.form.get('name')}
  public get phone() { return this.form.get('phone')}
  public get socialMediaLink() { return this.form.get('socialMediaLink')}
  data = input.required<ClientDialogData | null>()
  client: Client;

  dialogService = inject(DialogService)
  memberships: MembershipWithDetails[] = []
  membershipService = inject(MembershipService)

  private subscriptions: OutputRefSubscription[] = []
  memberRefs: Signal<readonly MembershipComponent[]> = viewChildren(MembershipComponent)

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    private spinnerService: SpinnerService,
    private clientService: ClientService
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
              this.client = result;
              this.name?.setValue(result.name)
              this.phone?.setValue(result.phone)
              this.socialMediaLink?.setValue(result.socialMediaLink)
            }
          })
      
        this.membershipService.getMembershipsByClient(this.data()?.id as string)
          .subscribe((result: MembershipWithDetails[]) =>{
            this.memberships = result
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
      this.dialogService.showDialog(ConfirmationDialogComponent, '', { message: 'Удалить клиента?'})
        .afterClosed().subscribe(reuslt =>{
          if(reuslt){
            this.clientService.deleteClient(this.client.id)
              .subscribe((result : string) =>{
                if(result){
                  this.dialogRef.close(result)
                }
              })
          }
        })
    }

    onAddMembershipClick(){
      this.dialogService.showDialog(MembershipDialogComponent, 'Абонемент', {
        client: this.client
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
          id: this.data()?.id as string,
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
          this.dialogRef.close(result)
        })
      }
    }

    onMembershipDelete(id: string){
      this.memberships = this.memberships.filter(x => x.id != id)
    }

}
