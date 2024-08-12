import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../group.service';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
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
    SpinnerComponent
  ],
  providers:[
    GroupService,
    SnackBarService
  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent implements DynamicComponent {
  private isLoading = new BehaviorSubject<boolean>(true)
  showSpinner$ : Observable<boolean> = this.isLoading.asObservable()

  name = new FormControl<string>('', [Validators.required])
  style = new FormControl<StyleModel| null>(null, [Validators.required])
  active = new FormControl<boolean>(true)
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
      if(this.data()?.id){
        this.groupService.getGroupById(this.data().id)
          .pipe(finalize(() => {
            this.isLoading.next(false)
          }))
          .subscribe((result: Group) =>{
            if(result){
              this.styleService.getAllStyles()
                .subscribe((styles: StyleModel[]) =>{
                  this.styles = styles
                  if(result.style)
                    this.style.setValue(this.styles.find(x => x.id === result.style?.id) as StyleModel)
            })
            
            this.group = result
            this.name?.setValue(result.name);
            this.active?.setValue(result.active);            
          }})
      }
    })
  }

  ngOnInit(){
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if (this.name.valid && this.style.valid){
      const group: Group = {
        id: this.data()?.id,
        name: this.name?.value as string,
        style: this.style?.value as StyleModel,
        active: this.active.value as boolean
      }
      this.spinnerService.loadingOn();
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
}
