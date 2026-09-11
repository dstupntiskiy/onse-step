import { Component, effect, inject, input, model, output } from '@angular/core';
import { CoachModel } from '../../../shared/models/coach-model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CoachService } from '../../../coaches/coach.service';
import { MatIconModule } from '@angular/material/icon';
import { EventCoachSubstitutionModel } from '../../event/event.model';
import { EventService } from '../../event/event.service';
import { SnackBarService } from '../../../services/snack-bar.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coach-substitution',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './coach-substitution.component.html',
  styleUrl: './coach-substitution.component.scss'
})
export class CoachSubstitutionComponent {
  eventId = input.required<string>()
  coach = input<CoachModel>()
  substitution = model<EventCoachSubstitutionModel | null>()
  coaches = input.required<CoachModel[] | null>()
  coachChange = output<string>()

  coachControl = new FormControl<string>('')
  substitutionControl = new FormControl<String>('')

  coachService = inject(CoachService)

  isEditing : boolean = false

  eventService = inject(EventService)
  snackBarService = inject(SnackBarService)

  constructor(){
    effect(() =>{
      if(this.coaches() && this.coach()){
        if(!this.coaches()?.find(x => x.id == this.coach()?.id)){
          this.coaches()?.push(this.coach() as CoachModel)
        }
        this.coachControl.setValue(this.coach()?.id as string)
        this.coachControl.disable()
      }
      if(this.coaches() && this.substitution()){
        this.substitutionControl.setValue(this.substitution()?.coach.id as string)
        this.substitutionControl.disable()
      }
    })
  }

  ngOnInit(){
    this.coachControl.valueChanges.subscribe((value) =>{
      if(value && !this.substitution()){
        this.coachChange.emit(value)
      }
    })
  }

  onCoachEdit(){
    this.isEditing = true
    this.substitutionControl.enable()
  }

  onSubstitutionChange(){
    if(this.substitutionControl.value != this.coach()?.id){
      this.eventService.addCoachSubstitution(this.eventId(), this.substitutionControl.value as string)
        .subscribe((result: EventCoachSubstitutionModel) =>{
          if(result){
            this.substitution.set(result)
            this.snackBarService.success("Замена добавлена")
          }
        })
    }
    this.coachControl.disable()
    this.isEditing = false
  }

  onSubstitutionDelete(){
    this.eventService.removeCoachSubstitution(this.substitution()?.id as string)
      .subscribe((result: string) =>{
        if(result){
          this.snackBarService.success("Замена удалена")
          this.substitutionControl.setValue(null)
          this.substitution.set(null)
        }
      })
  }
}
