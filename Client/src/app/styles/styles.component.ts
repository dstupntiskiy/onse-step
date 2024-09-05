import { Component, inject } from '@angular/core';
import { StyleService } from './style.service';
import { StyleModel } from '../shared/models/style-model';
import { DialogService } from '../services/dialog.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { StyleDialogComponent } from './style-dialog/style-dialog.component';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './styles.component.html',
  styleUrl: './styles.component.scss'
})
export class StylesComponent {
  styleService = inject(StyleService)
  displayedColumns: string[] = ['name', 'basePrice']
  dataSource: StyleModel[] = []
  dialogService = inject(DialogService)

  ngOnInit(){
    this.styleService.getAllStyles().subscribe((result: StyleModel[]) =>{
      this.dataSource = result
    })
  }

  handleAddStyleClick(){
    this.dialogService.showDialog(StyleDialogComponent, 'Направление')
      .afterClosed().subscribe((result: StyleModel) =>{
        if(result){
          const newData = [...this.dataSource]
          newData.unshift(result)
          this.dataSource = newData
        }
      })
  }

  handleRowClick(row: StyleModel){
    this.dialogService.showDialog(StyleDialogComponent, { style: row })
      .afterClosed().subscribe((result: StyleModel) =>{
        if(result){
          var index = this.dataSource.findIndex(x => x.id === row.id)
          this.dataSource[index] = result
          this.dataSource = Object.assign([], this.dataSource)
        }
      })
  }
}
