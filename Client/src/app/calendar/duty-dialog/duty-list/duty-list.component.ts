import { CommonModule } from '@angular/common';
import { Component, effect, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipListbox, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips'

export type Duty = {
  name: string, 
  color: string
}

@Component({
  selector: 'app-duty-list',
  imports: [MatChipsModule, 
    MatChipListbox,
    CommonModule,
    FormsModule
  ],
  templateUrl: './duty-list.component.html',
  styleUrl: './duty-list.component.scss'
})
export class DutyListComponent {
  currentDuty = model<Duty>()

  DutyList: Duty[] = [
    { name: 'Оля', color: '#FF9999'},
    { name: 'Тоня', color: '#FFFF99'},
    { name: 'Вика', color: '#A2FDB3'}
  ]

  constructor(){
    effect(() => {
      if(this.currentDuty() && !this.DutyList.find(x => x.name == this.currentDuty()?.name)){
        this.DutyList.push({ 
          name: this.currentDuty()?.name as string,
          color: this.currentDuty()?.color as string
      })
      }
    })
  }

  selectDuty(event: MatChipSelectionChange, duty: Duty){
    if(event.selected){
      this.currentDuty.set(duty)
    }
  }
}
