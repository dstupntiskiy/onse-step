import { Component, inject, signal } from '@angular/core';
import { StyleService } from './style.service';
import { StyleModel } from '../shared/models/style-model';
import { DialogService } from '../services/dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { StyleDialogComponent } from './style-dialog/style-dialog.component';
import { StyleCardComponent } from './style-card/style-card.component';
import { PageComponent } from '../shared/components/page/page.component';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    StyleCardComponent,
    MatButtonModule,
    PageComponent
  ],
  templateUrl: './styles.component.html',
  styleUrl: './styles.component.scss'
})
export class StylesComponent {
  styleService = inject(StyleService)

  styles = signal<StyleModel[]>([])
  dialogService = inject(DialogService)

  ngOnInit(){
    this.styleService.getAllStyles().subscribe((result: StyleModel[]) =>{
      this.styles.update(() => result)
    })
  }

  handleAddStyleClick(){
    this.dialogService.showDialog(StyleDialogComponent, 'Направление')
      .afterClosed().subscribe((result: StyleModel) =>{
        if(result){
          const newData = [...this.styles()]
          newData.unshift(result)
          this.styles.update(() => newData)
        }
      })
  }
}
