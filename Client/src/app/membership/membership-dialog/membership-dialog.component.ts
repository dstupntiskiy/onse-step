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
import { BehaviorSubject, combineLatestWith, finalize, forkJoin, Observable, of, pairwise, startWith } from 'rxjs';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

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
    SpinnerComponent
  ],
  templateUrl: './membership-dialog.component.html',
  styleUrl: './membership-dialog.component.scss'
})
export class MembershipDialogComponent {
  private isLoading = new BehaviorSubject<boolean>(false)
  showSpinner$ : Observable<boolean> = this.isLoading.asObservable()

  amount = new FormControl<number | null>(null, [Validators.required])
  startDate = new FormControl<string>('',[Validators.required])
  endDate = new FormControl<string>('', [Validators.required])
  visitsNumber = new FormControl<number>(8, [Validators.required])
  style = new FormControl<StyleModel | null>(null, [Validators.required])
  comment = new FormControl<string>('')
  id: string
  client: Client
  styles: StyleModel[] = []

  data = input.required<MembershipDialogData>()
  membershipService = inject(MembershipService)
  styleService = inject(StyleService)

  constructor(public dialogRef: MatDialogRef<MembershipDialogComponent>){
    effect(() => {
        this.isLoading.next(true)
        forkJoin({
          membership: this.data()?.id != null ? this.membershipService.getMembershipById(this.data().id as string) : of(null),
          styles: this.styleService.getAllStyles()
        })
        .pipe(
          finalize(() => this.isLoading.next(false))
        )
        .subscribe(result => {
          this.styles = result.styles

          if(result.membership){
            this.amount.setValue(result.membership.amount)
            this.startDate.setValue(result.membership.startDate.toString())
            this.endDate.setValue(result.membership.endDate.toString())
            this.comment.setValue(result.membership.comment as string)
            this.client = result.membership.client
            this.visitsNumber.setValue(result.membership.visitsNumber)
            this.style.setValue(this.styles.find(x => x.id == result.membership?.style.id) as StyleModel)
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
