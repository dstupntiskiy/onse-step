import { Component, inject } from '@angular/core';
import { CoachService } from './coach.service';
import { CoachModel } from '../shared/models/coach-model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../services/dialog.service';
import { CoachDialogComponent } from './coach-dialog/coach-dialog.component';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule],
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
  displayedColumns: string[] = ['name', 'style']

  ngOnInit(){
    this.coachesService.getCoaches().subscribe((result: CoachModel[]) => {
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

  handleRowClick(row: CoachModel){
    this.dialogService.showDialog(CoachDialogComponent, { coach: row })
      .afterClosed().subscribe((result: CoachModel) => {
        if(result)
        {
          var index = this.dataSource.findIndex(x => x.id === row.id)
          this.dataSource[index] = result
          this.dataSource = Object.assign([], this.dataSource)
        }
      })
  }


}
