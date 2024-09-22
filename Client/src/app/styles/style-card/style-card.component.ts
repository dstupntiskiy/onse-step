import { Component, inject, input, model, OutputRefSubscription } from '@angular/core';
import { StyleModel } from '../../shared/models/style-model';
import { DialogService } from '../../services/dialog.service';
import { StyleDialogComponent } from '../style-dialog/style-dialog.component';

@Component({
  selector: 'app-style-card',
  standalone: true,
  imports: [],
  templateUrl: './style-card.component.html',
  styleUrl: './style-card.component.scss'
})
export class StyleCardComponent {
  style = model.required<StyleModel>()

  dialogService = inject(DialogService)

  onClick(){
    this.dialogService.showDialog(StyleDialogComponent, { style: this.style()})
      .afterClosed().subscribe((result: StyleModel) =>{
        if(result){
          this.style.update(() => result)
        }
      })
  }
}
