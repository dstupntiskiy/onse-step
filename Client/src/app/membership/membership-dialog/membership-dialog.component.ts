import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../../shared/models/client-model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IMembershipSave, MembershipService } from '../membership.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { StyleService } from '../../styles/style.service';
import { StyleModel } from '../../shared/models/style-model';
import { BehaviorSubject, combineLatestWith, finalize, forkJoin, Observable, of, pairwise, startWith } from 'rxjs';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogService } from '../../services/dialog.service';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';

export interface MembershipDialogData{
  id?: string,
  client: Client,
  style: StyleModel
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
    MatSelectModule,
    SpinnerComponent,
    MatCheckboxModule
  ],
  templateUrl: './membership-dialog.component.html',
  styleUrl: './membership-dialog.component.scss'
})
export class MembershipDialogComponent {
  isLoading : boolean = true

  amount = new FormControl<number | null>(null, [Validators.required])
  startDate = new FormControl<string>('',[Validators.required])
  endDate = new FormControl<string>('', [Validators.required])
  visitsNumber = new FormControl<number>(8, [Validators.required])
  style = new FormControl<StyleModel | null>(null, [Validators.required])
  comment = new FormControl<string>('')
  unlimited = new FormControl<boolean>(false)

  client: Client
  styles: StyleModel[] = []

  data = input.required<MembershipDialogData>()
  membershipService = inject(MembershipService)
  styleService = inject(StyleService)
  dialogService = inject(DialogService)

  constructor(public dialogRef: MatDialogRef<MembershipDialogComponent>){
    effect(() => {
        forkJoin({
          membership: this.data()?.id != null ? this.membershipService.getMembershipById(this.data().id as string) : of(null),
          styles: this.styleService.getAllStyles()
        })
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe(result => {
          this.styles = result.styles

          if(result.membership){
            this.amount.setValue(result.membership.amount)
            this.startDate.setValue(result.membership.startDate.toString())
            this.endDate.setValue(result.membership.endDate.toString())
            this.comment.setValue(result.membership.comment as string)
            this.client = result.membership.client
            this.unlimited.setValue(result.membership.unlimited)
            this.visitsNumber.setValue(result.membership.visitsNumber as number)
            this.style.setValue(this.styles.find(x => x.id == result.membership?.style?.id) as StyleModel)
          }
          else{
            this.client = this.data().client

            var date = new Date()
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            this.startDate.setValue(firstDay.toISOString()) 
            this.endDate.setValue(lastDay.toISOString())
            this.visitsNumber.setValue(8)
            
            if(this.data().style){
              this.style.setValue(this.styles.find(x => x.id == this.data().style.id) as StyleModel)
            }
          }
        })
    })
  }

  ngOnInit(){
    this.style.valueChanges
      .pipe(
        startWith(this.style.value),
        pairwise())
      .subscribe(([prev, next]: [any, any]) =>{
        if(this.amount.value == null || prev?.basePrice == this.amount.value){
          this.amount.setValue(next.basePrice as number)
        }
      })

    this.unlimited.valueChanges
      .subscribe(value =>{
        if(value == true && this.amount.value == null){
          this.amount.setValue(18000)
        }
      })
  }

  onSave(){
    if(this.isValid()){
      var membership: IMembershipSave = {
        id: this.data().id as string,
        amount: this.amount.value as number,
        clientId: this.client.id,
        startDate: this.startDate.value as string,
        endDate: this.endDate.value as string,
        comment: this.comment.value as string,
        unlimited: this.unlimited.value as boolean,
        styleId: this.unlimited.value ? undefined : this.style.value?.id as string,
        visitsNumber: this.unlimited.value ? undefined : this.visitsNumber.value as number
      }

      if(!membership.unlimited){
        membership.styleId = this.style.value?.id as string
        membership.visitsNumber = this.visitsNumber.value as number
      }
      
      this.membershipService.saveMembership(membership)
        .subscribe((result) => this.dialogRef.close(result))
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  onDelete(){
    this.dialogService.showDialog(ConfirmationDialogComponent, '', {
      message: 'Удалить абонемент?'
    }).afterClosed().subscribe(result =>{
      if(result == true){
        this.membershipService.deleteMembership(this.data().id as string)
          .subscribe((deletedId: string) =>{
            this.dialogRef.close(deletedId)
          })
      }
    })
  }

  private isValid(): boolean{
    return this.amount.valid 
    && this.startDate.valid
    && this.endDate.valid
    && this.visitsNumber.valid
  }
}
