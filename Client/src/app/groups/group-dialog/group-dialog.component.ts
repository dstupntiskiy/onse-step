import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Group } from '../../shared/models/group-model';
import { GroupService, IGroupSave } from '../group.service';
import { finalize, forkJoin, of } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { GroupMembersComponent } from '../group-members/group-members.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StyleService } from '../../styles/style.service';
import { StyleModel } from '../../shared/models/style-model';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

export interface GroupDialogData{
  id: string
}

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    GroupMembersComponent,
    MatSelectModule,
    SpinnerComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers:[
    GroupService,
    SnackBarService
  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent implements DynamicComponent {
  title = signal<string>('Группа')
  isLoading : boolean = false

  name = new FormControl<string>('', [Validators.required])
  style = new FormControl<StyleModel| null>(null, [Validators.required])
  active = new FormControl<boolean>(true)
  startDate = new FormControl<string | null>(null, [Validators.required]);
  endDate = new FormControl<string | null>(null)

  group: Group

  public isNew: boolean = false;
  styles: StyleModel[] = []

  data = input.required<GroupDialogData>() 
  groupService = inject(GroupService)
  spinnerService = inject(SpinnerService)
  styleService = inject(StyleService)

  constructor(private dialogRef: MatDialogRef<GroupDialogComponent>,
  ){
    effect(()=>{
        this.isLoading = true

        forkJoin({
          group: this.data()?.id != null ? this.groupService.getGroupById(this.data().id) : of(null),
          styles: this.styleService.getAllStyles()
        })
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe(result =>{
          this.styles = result.styles
          if(result.group){
            this.title.set(result.group.name)

            this.group = result.group
            this.name?.setValue(result.group.name);
            this.active?.setValue(result.group.active);
            this.startDate.setValue(result.group.startDate.toString())
            this.endDate.setValue(result.group.endDate?.toString() as string)
          }

          var date = new Date()
          var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
          var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          if(!this.group){
            this.startDate.setValue(firstDay.toISOString())
            this.endDate.setValue(lastDay.toISOString())
          }

          const style = result.group?.style
          if(style){
            this.style.setValue(this.styles.find(x => x.id === style.id) as StyleModel)
          }
        })
    })
  }

  ngOnInit(){
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if(this.validateForm()){
      this.spinnerService.loadingOn();

      var group: IGroupSave = {
        id: this.data()?.id,
        name: this.name.value as string,
        styleId: this.style?.value?.id,
        active: this.active.value as boolean,
        startDate: this.startDate.value as string,
        endDate: this.endDate.value ? this.endDate?.value as string : undefined
      }
      this.groupService.saveGroup(group)
      .pipe(
        finalize(() => this.spinnerService.loadingOff()),
      )
      .subscribe(
        (result: Group) =>{
          this.dialogRef.close(result);
        });
      
    }
  }

  private validateForm(): boolean{
    if (this.name.invalid || this.style.invalid || this.startDate.invalid){
      return false
    }

    var start = new Date(this.startDate.value as string)
    var end = new Date(this.endDate.value as string)
    if (end < start){
      this.endDate.setErrors({invalidEndDate: true})
      return false
    }

    return true
  }
}
