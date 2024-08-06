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
import { MatSelectModule } from '@angular/material/select';
import { StyleService } from '../../styles/style.service';
import { StyleModel } from '../../shared/models/style-model';

export interface MembershipDialogData{
  client: Client,
  amount?: number,
  startDate?: string,
  endDate?: string,
  visitsNumber?: number,
  comment?: string,
  style: StyleModel
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
    MatSelectModule
  ],
  templateUrl: './membership-dialog.component.html',
  styleUrl: './membership-dialog.component.scss'
})
export class MembershipDialogComponent {
  amount = new FormControl<number | null>(null, [Validators.required])
  startDate = new FormControl<string>('',[Validators.required])
  endDate = new FormControl<string>('', [Validators.required])
  visitsNumber = new FormControl<number>(8, [Validators.required])
  style = new FormControl<StyleModel | null>(null, [Validators.required])
  comment = new FormControl<string>('')
  id: string = ''
  client: Client
  styles: StyleModel[] = []

  data = input.required<MembershipDialogData>()
  membershipService = inject(MembershipService)
  styleService = inject(StyleService)

  constructor(public dialogRef: MatDialogRef<MembershipDialogComponent>){
    effect(() => {
      this.amount.setValue(this.data()?.amount as number)
      
      this.styleService.getAllStyles()
        .subscribe((styles: StyleModel[]) =>{
          this.styles = styles
          if(this.data().style){
            this.style.setValue(this.styles.find(x => x.id === this.data()?.style?.id) as StyleModel)
            this.data().amount == null ?
              this.amount.setValue(this.style.value?.basePrice as number)
              : this.amount.setValue(this.data()?.amount as number)
          }
        })

      this.id = this.data()?.id as string

      var date = new Date()
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      this.data().startDate === null ? 
        this.startDate.setValue(this.data()?.startDate as string)
        : this.startDate.setValue(firstDay.toISOString())

      this.data().endDate === null ? 
        this.endDate.setValue(this.data()?.endDate as string)
        : this.endDate.setValue(lastDay.toISOString())

      this.data().visitsNumber == null ?
        this.visitsNumber.setValue(8)
        : this.visitsNumber.setValue(this.data()?.visitsNumber as number)

      this.comment.setValue(this.data()?.comment as string)
      this.client = this.data()?.client
    })
  }

  ngOnInit(){
    this.style.valueChanges
      .subscribe((value) =>{
        if(value && this.data().amount == null){
          this.amount.setValue(value.basePrice as number)
        }
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
        styleId: this.style.value?.id as string,
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
