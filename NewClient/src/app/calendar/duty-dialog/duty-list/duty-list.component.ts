import { Component, effect, model, ChangeDetectionStrategy } from '@angular/core';

export type Duty = {
  name: string, 
  color: string
}

@Component({
  selector: 'app-duty-list',
  templateUrl: './duty-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

}
