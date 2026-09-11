import { Component, computed, input } from '@angular/core';
@Component({selector:'app-page-header',standalone:true,templateUrl:'./page-header.component.html',styleUrl:'./page-header.component.scss'})
export class PageHeaderComponent {
 header = input<string>();
 description = computed(() => ({'Клиенты':'Люди, с которыми мы разделяем любовь к танцу.','Группы':'Свои люди. Общий ритм. Большие результаты.','Тренеры':'Команда, которая вдохновляет двигаться.','Направления':'Разные стили. Одна любовь к танцу.','Отчеты':'Вся картина работы студии — в цифрах.'}[this.header() || ''] || 'Всё важное для вашей студии.'));
}