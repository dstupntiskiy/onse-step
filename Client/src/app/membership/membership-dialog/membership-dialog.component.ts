import { booleanAttribute, Component, computed, effect, inject, input, output, signal } from '@angular/core';
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
import { finalize, forkJoin, of} from 'rxjs';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogService } from '../../services/dialog.service';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MembershipWithDetails } from '../../shared/models/membership-model';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';

export interface MembershipDialogData{
  id?: string,
  client: Client,
  style: StyleModel
}

export type VisitsCount = 8 | 4
export type DiscountType = 0 | 20 | 100

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
    MatCheckboxModule,
    MatButtonToggleModule
  ],
  templateUrl: './membership-dialog.component.html',
  styleUrl: './membership-dialog.component.scss'
})
export class MembershipDialogComponent implements DynamicComponent  {
  title = signal<string>('Абонемент')
  isLoading : boolean = true

  private readonly UNLIMITED_PRICE = 18000

  visitsCount = signal<VisitsCount>(8)

  discountSignal = signal<DiscountType>(0)
  isUnlimited = signal<boolean>(false)
  styleSignal = signal<StyleModel | undefined | null>(undefined)
  payedAmountSignal = signal<number>(0)

  price = computed(() => {
    if(this.isUnlimited() === true){
      return this.UNLIMITED_PRICE
    }
    if(this.styleSignal()){
      var price = this.visitsCount() == 8 ? <number>this.styleSignal()?.basePrice : <number>this.styleSignal()?.secondaryPrice
      return price * (100 - this.discountSignal()) / 100
    }
    return 0
  })

  startDate = new FormControl<string>('',[Validators.required])
  endDate = new FormControl<string>('', [Validators.required])
  style = new FormControl<StyleModel | null>(null, [Validators.required])
  comment = new FormControl<string>('')
  unlimited = new FormControl<boolean>(false)

  client: Client
  styles: StyleModel[] = []

  data = input.required<MembershipDialogData>()
  membershipService = inject(MembershipService)
  styleService = inject(StyleService)
  dialogService = inject(DialogService)
  spinnerService = inject(SpinnerService)

  membershipSaved = output<MembershipWithDetails>()
  membershipDeleted = output<string>()

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
            this.payedAmountSignal.set(result.membership.amount)
            this.startDate.setValue(result.membership.startDate.toString())
            this.endDate.setValue(result.membership.endDate.toString())
            this.comment.setValue(result.membership.comment as string)
            this.client = result.membership.client
            this.unlimited.setValue(result.membership.unlimited)
            this.visitsCount.set(result.membership.visitsNumber as VisitsCount)
            this.style.setValue(this.styles.find(x => x.id == result.membership?.style?.id) as StyleModel)
            this.discountSignal.set(result.membership.discount as DiscountType)
          }
          else{
            this.client = this.data().client

            var date = new Date()
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            this.startDate.setValue(firstDay.toISOString()) 
            this.endDate.setValue(lastDay.toISOString())
            
            if(this.data().style){
              this.style.setValue(this.styles.find(x => x.id == this.data().style.id) as StyleModel)
              this.styleSignal.update(() => this.data().style)
            }
          }
        })
    })
  }

  ngOnInit(){
    this.style.valueChanges
      .subscribe(value => {
        this.styleSignal.set(value)
      })

    this.unlimited.valueChanges
      .subscribe(value =>{
          this.isUnlimited.set(booleanAttribute(value))
      })
  }

  onSave(){
    if(this.isValid()){
      var membership: IMembershipSave = {
        id: this.data().id as string,
        amount: this.price(),
        clientId: this.client.id,
        startDate: this.startDate.value as string,
        endDate: this.endDate.value as string,
        comment: this.comment.value as string,
        unlimited: this.unlimited.value as boolean,
        styleId: this.unlimited.value ? undefined : this.style.value?.id as string,
        visitsNumber: this.unlimited.value ? undefined : this.visitsCount(),
        discount: this.discountSignal()
      }

      if(!membership.unlimited){
        membership.styleId = this.style.value?.id as string
        membership.visitsNumber = this.visitsCount()
      }
      
      this.spinnerService.loadingOn()
      this.membershipService.saveMembership(membership)
        .pipe(finalize(() => this.spinnerService.loadingOff()))
        .subscribe((result) => {
          this.membershipSaved.emit(result)
          this.dialogRef.close(result)
      })
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  onDelete(){
    this.dialogService.showDialog(ConfirmationDialogComponent, {
      message: 'Удалить абонемент?'
    }).afterClosed().subscribe(result =>{
      if(result == true){
        this.spinnerService.loadingOn()
        this.membershipService.deleteMembership(this.data().id as string)
          .pipe(finalize(() => this.spinnerService.loadingOff()))
          .subscribe((deletedId: string) =>{
            this.membershipDeleted.emit(deletedId)
            this.dialogRef.close()
          })
      }
    })
  }

  onVisitsCOuntChange(visits: VisitsCount){
    this.visitsCount.update(() => visits)
  }

  onSaleChange(sale: DiscountType){
    this.discountSignal.update(() => sale)
  }

  private isValid(): boolean{
    return this.startDate.valid
    && this.endDate.valid
  }
}
