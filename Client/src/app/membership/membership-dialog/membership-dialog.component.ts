import { Component, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../../shared/models/client-model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IMembershipSave, MembershipService } from '../membership.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MembershipModel } from '../../shared/models/membership-model';

export interface MembershipDialogData{
  client: Client,
  amount?: number,
  startDate?: string,
  endDate?: string,
  visitsNumber?: number,
  comment?: string,
  id?: string
}
@Component({
  selector: 'app-membership-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './membership-dialog.component.html',
  styleUrl: './membership-dialog.component.scss'
})
export class MembershipDialogComponent {
  amount = new FormControl<number | null>(null, [Validators.required])
  startDate = new FormControl<string>('',[Validators.required])
  endDate = new FormControl<string>('', [Validators.required])
  visitsNumber = new FormControl<number>(8, [Validators.required])
  comment = new FormControl<string>('')
  id: string = ''
  client: Client


  data = input.required<MembershipDialogData>()
  membershipService = inject(MembershipService)

  constructor(public dialogRef: MatDialogRef<MembershipDialogComponent>){
    effect(() => {
      this.id = this.data()?.id as string
      this.amount.setValue(this.data()?.amount as number)
      this.startDate.setValue(this.data()?.startDate as string)
      this.endDate.setValue(this.data()?.endDate as string)
      this.visitsNumber.setValue(this.data()?.visitsNumber as number)
      this.comment.setValue(this.data()?.comment as string)
      this.client = this.data()?.client

      
    })
  }

  onSave(){
    if(this.isValid()){
      var membership: IMembershipSave = {
        id: this.id,
        amount: this.amount.value as number,
        clientId: this.client.id,
        startDate: this.startDate.value as string,
        endDate: this.endDate.value as string,
        comment: this.comment.value as string,
        visitsNumber: this.visitsNumber.value as number
      }
      
      this.membershipService.saveMembership(membership)
        .subscribe((result) => this.dialogRef.close(result))
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  private isValid(): boolean{
    return this.amount.valid 
    && this.startDate.valid
    && this.endDate.valid
    && this.visitsNumber.valid
  }
}
