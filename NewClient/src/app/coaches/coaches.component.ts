import { Component, inject } from '@angular/core';
import { CoachService } from './coach.service';
import { CoachModel } from '../shared/models/coach-model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../services/dialog.service';
import { CoachDialogComponent } from './coach-dialog/coach-dialog.component';
import { PageComponent } from '../shared/components/page/page.component';
import { CoachCardComponent } from './coach-card/coach-card.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    PageComponent,
    CoachCardComponent,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  providers:[
    CoachService
  ],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.scss'
})
export class CoachesComponent {
  coachesService = inject(CoachService)
  dialogService = inject(DialogService)
  dataSource: CoachModel[]

  onlyActive = new FormControl<boolean>(true)

  ngOnInit(){
    this.loadCoaches()

    this.onlyActive.valueChanges.subscribe(() => {
      this.dataSource = []
      this.loadCoaches()
    })
  }

  loadCoaches(){
    this.coachesService.getCoaches(this.onlyActive.value as boolean).subscribe((result: CoachModel[]) => {
      this.dataSource = result
    })
  }

  handleAddCoachClick(){
    this.dialogService.showDialog(CoachDialogComponent, 'Тренер')
      .afterClosed().subscribe((result: CoachModel) =>{
        if(result)
        {
          const newData = [...this.dataSource]
          newData.unshift(result)
          this.dataSource = newData
        }
      })
  }
}
