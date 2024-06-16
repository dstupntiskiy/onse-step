import { Component, inject } from '@angular/core';
import { CoachService } from './coach.service';
import { CoachModel } from '../shared/models/coach-model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CoachDialogService } from './coach-dialog/coach-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule],
  providers:[
    CoachService,
    CoachDialogService,
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.scss'
})
export class CoachesComponent {
  coachesService = inject(CoachService)
  coachDialogService = inject(CoachDialogService)
  dataSource: CoachModel[]
  displayedColumns: string[] = ['name', 'style']

  ngOnInit(){
    this.coachesService.getCoaches().subscribe((result: CoachModel[]) => {
      this.dataSource = result
    })
  }

  handleAddCoachClick(){
    this.coachDialogService.showCoachDialog()
      .afterClosed().subscribe((result: CoachModel) =>{
        if(result)
        {
          const newData = [...this.dataSource]
          newData.unshift(result)
          this.dataSource = newData
        }
      })
  }

  handleRowClick(row: CoachModel){
    this.coachDialogService.showCoachDialog(row.name, row)
      .afterClosed().subscribe((result: CoachModel) => {
        var index = this.dataSource.findIndex(x => x.id === row.id)
        this.dataSource[index] = result
        this.dataSource = Object.assign([], this.dataSource)
      })
  }


}
