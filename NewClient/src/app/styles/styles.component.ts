import { Component, inject, signal } from '@angular/core';
import { StyleService } from './style.service';
import { StyleModel } from '../shared/models/style-model';
import { DialogService } from '../services/dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { StyleDialogComponent } from './style-dialog/style-dialog.component';
import { StyleCardComponent } from './style-card/style-card.component';
import { PageComponent } from '../shared/components/page/page.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    StyleCardComponent,
    MatButtonModule,
    PageComponent,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './styles.component.html',
  styleUrl: './styles.component.scss'
})
export class StylesComponent {
  styleService = inject(StyleService)
  spinnerService = inject(SpinnerService)

  styles = signal<StyleModel[]>([])
  dialogService = inject(DialogService)

  onlyActive = new FormControl<boolean>(true)

  ngOnInit(){
   this.loadStyles()

    this.onlyActive.valueChanges.subscribe(() => {
      this.styles.set([])
      this.loadStyles()
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

  loadStyles(){
    this.spinnerService.loadingOn()
    this.styleService.getAllStyles(this.onlyActive.value as boolean)
      .pipe(finalize(() => this.spinnerService.loadingOff()))
      .subscribe((result: StyleModel[]) =>{
        this.styles.update(() => result)
      })
  }
}
